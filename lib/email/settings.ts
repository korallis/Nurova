import 'server-only';
import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';
import { eq } from 'drizzle-orm';
import { db, hasDatabase, schema } from '@/lib/db';
import { getSingle } from '@/lib/content/queries';
import { EMAIL_ROUTES, type EmailRoute } from './routes';

/*
 * Microsoft Graph email settings. Super admins enter them in the dashboard
 * (Settings → Email); any field left blank there falls back to the matching
 * environment variable:
 *
 *   MICROSOFT_GRAPH_TENANT_ID, MICROSOFT_GRAPH_CLIENT_ID,
 *   MICROSOFT_GRAPH_CLIENT_SECRET, MICROSOFT_GRAPH_SENDER_ID
 *
 * The client secret is stored encrypted (AES-256-GCM) with a key derived from
 * SESSION_SECRET, so changing SESSION_SECRET means re-entering the secret.
 */

const KEY = 'email';

export interface RouteSetting {
  enabled: boolean;
  /** Comma-separated addresses. */
  to: string;
}

/** What's stored in app_settings (the secret only ever encrypted). */
interface StoredEmailSettings {
  enabled: boolean;
  tenantId: string;
  clientId: string;
  /** iv.tag.ciphertext, base64url. */
  clientSecretEnc: string;
  senderId: string;
  siteUrl: string;
  routes: Partial<Record<EmailRoute, RouteSetting>>;
}

/** Ready to use: env fallbacks applied and the secret decrypted. Server-only. */
export interface EmailSettings {
  enabled: boolean;
  tenantId: string;
  clientId: string;
  clientSecret: string;
  senderId: string;
  siteUrl: string;
  routes: Record<EmailRoute, RouteSetting>;
  /** Which connection values come from the environment rather than the dashboard. */
  fromEnv: { tenantId: boolean; clientId: boolean; clientSecret: boolean; senderId: boolean };
  /** A secret is saved but can't be decrypted (SESSION_SECRET changed). */
  secretUnreadable: boolean;
}

/** Used for links in emails until a website address is saved in Settings → Email. Vercel sets the production domain. */
export const DEFAULT_SITE_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : 'http://localhost:3000';

function key() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error('SESSION_SECRET is not set.');
  return createHash('sha256').update(`${secret}:app-settings:email`).digest();
}

export function encryptSecret(plain: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key(), iv);
  const data = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
  return [iv, cipher.getAuthTag(), data].map((b) => b.toString('base64url')).join('.');
}

function decryptSecret(enc: string): string | null {
  try {
    const [iv, tag, data] = enc.split('.').map((part) => Buffer.from(part, 'base64url'));
    const decipher = createDecipheriv('aes-256-gcm', key(), iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(data), decipher.final()]).toString('utf8');
  } catch {
    return null;
  }
}

async function readStored(): Promise<Partial<StoredEmailSettings>> {
  if (!hasDatabase) return {};
  const [row] = await db().select({ value: schema.appSettings.value }).from(schema.appSettings).where(eq(schema.appSettings.key, KEY));
  return (row?.value ?? {}) as Partial<StoredEmailSettings>;
}

/** Where each form's emails go when nothing has been set: the enquiries mailbox from Site settings. */
async function defaultRoutes(): Promise<Record<EmailRoute, RouteSetting>> {
  const { contact } = await getSingle('settings');
  return Object.fromEntries(
    EMAIL_ROUTES.map(({ id, defaultOn }) => [id, { enabled: defaultOn, to: contact.enquiriesEmail }])
  ) as Record<EmailRoute, RouteSetting>;
}

export async function getEmailSettings(): Promise<EmailSettings> {
  const stored = await readStored();
  const env = process.env;
  const decrypted = stored.clientSecretEnc ? decryptSecret(stored.clientSecretEnc) : null;
  const pick = (saved: string | undefined, envValue: string | undefined) => (saved?.trim() ? saved.trim() : (envValue ?? '').trim());
  const defaults = await defaultRoutes();

  return {
    enabled: stored.enabled ?? true,
    tenantId: pick(stored.tenantId, env.MICROSOFT_GRAPH_TENANT_ID),
    clientId: pick(stored.clientId, env.MICROSOFT_GRAPH_CLIENT_ID),
    clientSecret: pick(decrypted ?? '', env.MICROSOFT_GRAPH_CLIENT_SECRET),
    senderId: pick(stored.senderId, env.MICROSOFT_GRAPH_SENDER_ID),
    siteUrl: (stored.siteUrl?.trim() || DEFAULT_SITE_URL).replace(/\/+$/, ''),
    routes: Object.fromEntries(EMAIL_ROUTES.map(({ id }) => [id, { ...defaults[id], ...stored.routes?.[id] }])) as Record<EmailRoute, RouteSetting>,
    fromEnv: {
      tenantId: !stored.tenantId?.trim() && Boolean(env.MICROSOFT_GRAPH_TENANT_ID),
      clientId: !stored.clientId?.trim() && Boolean(env.MICROSOFT_GRAPH_CLIENT_ID),
      clientSecret: !decrypted && Boolean(env.MICROSOFT_GRAPH_CLIENT_SECRET),
      senderId: !stored.senderId?.trim() && Boolean(env.MICROSOFT_GRAPH_SENDER_ID),
    },
    secretUnreadable: Boolean(stored.clientSecretEnc) && decrypted === null,
  };
}

/** All four Microsoft values are present. */
export const isConfigured = (s: EmailSettings) => Boolean(s.tenantId && s.clientId && s.clientSecret && s.senderId);

export interface EmailSettingsInput {
  enabled: boolean;
  tenantId: string;
  clientId: string;
  /** Blank keeps the saved secret. */
  clientSecret: string;
  removeSecret: boolean;
  senderId: string;
  siteUrl: string;
  routes: Record<EmailRoute, RouteSetting>;
}

export async function saveEmailSettings(input: EmailSettingsInput, adminId: string) {
  const stored = await readStored();
  const clientSecretEnc = input.removeSecret ? '' : input.clientSecret ? encryptSecret(input.clientSecret) : (stored.clientSecretEnc ?? '');
  const value: StoredEmailSettings = {
    enabled: input.enabled,
    tenantId: input.tenantId,
    clientId: input.clientId,
    clientSecretEnc,
    senderId: input.senderId,
    siteUrl: input.siteUrl,
    routes: input.routes,
  };
  const now = new Date();
  await db()
    .insert(schema.appSettings)
    .values({ key: KEY, value, updatedAt: now, updatedBy: adminId })
    .onConflictDoUpdate({ target: schema.appSettings.key, set: { value, updatedAt: now, updatedBy: adminId } });
}
