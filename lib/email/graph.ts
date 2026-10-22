import 'server-only';
import type { EmailSettings } from './settings';

/*
 * Sends mail through Microsoft Graph with an app registration (client
 * credentials). The app needs the Mail.Send *application* permission with
 * admin consent, and the sender is the mailbox it sends as (an email address
 * or user ID), e.g. a shared "no-reply" or "website" mailbox.
 */

interface CachedToken {
  key: string;
  token: string;
  expiresAt: number;
}

let cached: CachedToken | null = null;

async function accessToken(s: EmailSettings): Promise<string> {
  const key = `${s.tenantId}:${s.clientId}:${s.clientSecret.slice(-6)}`;
  if (cached && cached.key === key && cached.expiresAt > Date.now() + 60_000) return cached.token;

  const res = await fetch(`https://login.microsoftonline.com/${encodeURIComponent(s.tenantId)}/oauth2/v2.0/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: s.clientId,
      client_secret: s.clientSecret,
      scope: 'https://graph.microsoft.com/.default',
      grant_type: 'client_credentials',
    }),
    signal: AbortSignal.timeout(10_000),
  });
  const body = (await res.json().catch(() => ({}))) as { access_token?: string; expires_in?: number; error_description?: string };
  if (!res.ok || !body.access_token) {
    throw new Error(`Microsoft sign-in failed: ${body.error_description?.split('\r\n')[0] ?? `HTTP ${res.status}`}`);
  }
  cached = { key, token: body.access_token, expiresAt: Date.now() + (body.expires_in ?? 3600) * 1000 };
  return body.access_token;
}

export interface ConnectionCheck {
  signedIn: boolean;
  /** Microsoft's error when sign-in failed. */
  error?: string;
  /** The app Microsoft recognised, from the fresh token. */
  appName?: string;
  /** Application permissions actually granted, e.g. ["Mail.Send"]. */
  roles: string[];
  canSend: boolean;
}

/**
 * Settings → Email "Check connection": signs in to Microsoft with a fresh
 * token (dropping any cached one) and reports what the app is allowed to do.
 */
export async function checkConnection(s: EmailSettings): Promise<ConnectionCheck> {
  cached = null;
  try {
    const token = await accessToken(s);
    const claims = JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString()) as { roles?: string[]; app_displayname?: string };
    const roles = claims.roles ?? [];
    return { signedIn: true, appName: claims.app_displayname, roles, canSend: roles.includes('Mail.Send') };
  } catch (error) {
    return { signedIn: false, error: error instanceof Error ? error.message : String(error), roles: [], canSend: false };
  }
}

export interface OutgoingEmail {
  to: string[];
  subject: string;
  html: string;
  /** Replies go here, e.g. the person who filled in the form. */
  replyTo?: { address: string; name?: string };
}

/** The app's application permissions, read from its token (e.g. ["Mail.Send"]). */
const tokenRoles = (token: string): string[] => {
  try {
    return (JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString()) as { roles?: string[] }).roles ?? [];
  } catch {
    return [];
  }
};

export async function sendGraphMail(s: EmailSettings, email: OutgoingEmail, retried = false): Promise<void> {
  const token = await accessToken(s);
  const res = await fetch(`https://graph.microsoft.com/v1.0/users/${encodeURIComponent(s.senderId)}/sendMail`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: {
        subject: email.subject,
        body: { contentType: 'HTML', content: email.html },
        toRecipients: email.to.map((address) => ({ emailAddress: { address } })),
        ...(email.replyTo ? { replyTo: [{ emailAddress: { address: email.replyTo.address, name: email.replyTo.name || undefined } }] } : {}),
      },
      saveToSentItems: false,
    }),
    signal: AbortSignal.timeout(15_000),
  });
  if (res.status !== 202) {
    const body = (await res.json().catch(() => ({}))) as { error?: { code?: string; message?: string } };
    if (body.error?.code === 'ErrorAccessDenied') {
      // A token fetched before permission was granted doesn't carry it: try once more with a fresh one.
      if (!retried) {
        cached = null;
        return sendGraphMail(s, email, true);
      }
      if (!tokenRoles(token).includes('Mail.Send')) {
        throw new Error(
          'Microsoft refused to send because the app doesn’t have permission yet. In Microsoft Entra ID → App registrations → this app → API permissions, add Microsoft Graph → Application permissions → Mail.Send, then click “Grant admin consent”.'
        );
      }
      throw new Error(
        `Microsoft refused to send from ${s.senderId}. The app has Mail.Send, so check that this mailbox exists in your Microsoft 365 organisation, and that any application access policy allows the app to use it.`
      );
    }
    throw new Error(`Microsoft couldn’t send the email: ${body.error?.message ?? `HTTP ${res.status}`}${body.error?.code ? ` (${body.error.code})` : ''}`);
  }
}
