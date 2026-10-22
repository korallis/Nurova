'use client';

import { useActionState } from 'react';
import { CheckCircle2, CircleAlert, RefreshCw, Send, XCircle } from 'lucide-react';
import {
  checkConnectionAction,
  saveEmailSettingsAction,
  sendTestEmailAction,
  type ConnectionState,
  type EmailFormState,
} from '@/lib/admin/email-actions';
import { EMAIL_ROUTES, type EmailRoute } from '@/lib/email/routes';
import { inputClass } from './MediaInputs';

/** What the page passes in. Never includes the client secret itself. */
export interface EmailSettingsView {
  enabled: boolean;
  tenantId: string;
  clientId: string;
  senderId: string;
  siteUrl: string;
  hasSecret: boolean;
  secretUnreadable: boolean;
  configured: boolean;
  fromEnv: { tenantId: boolean; clientId: boolean; clientSecret: boolean; senderId: boolean };
  routes: Record<EmailRoute, { enabled: boolean; to: string }>;
}

const card = 'space-y-4 rounded-xl border border-neutral-200 bg-white p-5';
const label = 'block text-sm font-semibold';
const help = 'mt-1 block text-xs font-normal text-neutral-500';
const submit = 'inline-flex cursor-pointer items-center gap-2 rounded-full bg-brand-coral px-5 py-2 text-sm font-bold text-white hover:brightness-95 disabled:opacity-60';

function Result({ state }: { state: EmailFormState }) {
  if (state.error) return <p role="alert" className="text-sm font-semibold text-red-600">{state.error}</p>;
  if (state.success) return <p role="status" className="text-sm font-semibold text-green-700">{state.success}</p>;
  return null;
}

const Step = ({ ok, children }: { ok: boolean; children: React.ReactNode }) => (
  <li className="flex gap-2">
    {ok ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-700" aria-hidden="true" /> : <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" aria-hidden="true" />}
    <span>{children}</span>
  </li>
);

/** What "Check connection" found, with the fix when the permission is missing. */
function ConnectionResult({ state }: { state: ConnectionState }) {
  if (state.error) return <p role="alert" className="text-sm font-semibold text-red-600">{state.error}</p>;
  const r = state.result;
  if (!r) return null;
  const link = 'font-semibold text-brand-coral underline';
  return (
    <div role="status" className="space-y-3 rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-sm">
      <p className="text-xs text-neutral-500">Checked at {state.checkedAt}</p>
      <ul className="space-y-1.5">
        <Step ok={r.signedIn}>
          {r.signedIn ? (
            <>
              Signed in to Microsoft as <strong>{r.appName ?? 'your app'}</strong>.
            </>
          ) : (
            <>Sign-in failed: {r.error}</>
          )}
        </Step>
        {r.signedIn && (
          <Step ok={r.canSend}>
            {r.canSend ? (
              <>
                Permission to send email (<strong>Mail.Send</strong>) is granted. Emails will send.
              </>
            ) : (
              <>
                <strong>Mail.Send is not granted yet</strong>, so Microsoft will refuse to send.{' '}
                {r.roles.length ? `Granted permissions: ${r.roles.join(', ')}.` : 'The app has no application permissions at all.'}
              </>
            )}
          </Step>
        )}
      </ul>
      {r.signedIn && !r.canSend && state.links && (
        <ol className="list-decimal space-y-1.5 pl-5">
          <li>
            Open the app’s{' '}
            <a href={state.links.permissions} target="_blank" rel="noopener noreferrer" className={link}>
              API permissions
            </a>{' '}
            and add <strong>Microsoft Graph → Application permissions → Mail.Send</strong> (not “Delegated”).
          </li>
          <li>
            A <strong>Global Administrator</strong> or <strong>Privileged Role Administrator</strong> then clicks “Grant admin consent” there, or opens the{' '}
            <a href={state.links.consent} target="_blank" rel="noopener noreferrer" className={link}>
              admin consent link
            </a>{' '}
            and accepts. (A “redirect” error page afterwards is normal.)
          </li>
          <li>Come back and click Check connection again.</li>
        </ol>
      )}
    </div>
  );
}

/** "From the MICROSOFT_GRAPH_… environment variable" hint under a field. */
const envNote = (on: boolean, name: string) => (on ? <span className={help}>Currently using the {name} environment variable. Fill this in to override it.</span> : null);

export function EmailSettingsForm({ settings }: { settings: EmailSettingsView }) {
  const [state, action, pending] = useActionState<EmailFormState, FormData>(saveEmailSettingsAction, {});
  const [testState, testAction, testing] = useActionState<EmailFormState, FormData>(sendTestEmailAction, {});
  const [checkState, checkAction, checking] = useActionState<ConnectionState, FormData>(checkConnectionAction, {});

  return (
    <div className="space-y-6">
      <div className={`flex gap-3 rounded-xl border p-4 text-sm ${settings.configured ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'}`}>
        {settings.configured ? (
          <CheckCircle2 className="h-5 w-5 shrink-0 text-green-700" aria-hidden="true" />
        ) : (
          <CircleAlert className="h-5 w-5 shrink-0 text-amber-600" aria-hidden="true" />
        )}
        <p>
          {settings.configured ? (
            <>
              <strong>Microsoft email is set up.</strong> {settings.enabled ? 'Forms are being forwarded by email as well as to the Inbox.' : 'Forwarding is switched off, so forms only go to the Inbox.'} Send a test below to check it works.
            </>
          ) : (
            <>
              <strong>Not set up yet.</strong> Until all four Microsoft values are added, forms only go to the dashboard Inbox. Nothing is lost: everything is still saved there.
            </>
          )}
          {settings.secretUnreadable && (
            <span className="mt-1 block font-semibold text-red-600">The saved client secret can’t be read any more (SESSION_SECRET was changed). Please enter it again.</span>
          )}
        </p>
      </div>

      <form action={action} className="space-y-6">
        <section className={card}>
          <div>
            <h2 className="text-lg font-bold">Microsoft 365 connection</h2>
            <p className="text-sm text-neutral-500">
              From the app registration in Microsoft Entra ID. The app needs the <strong>Mail.Send</strong> application permission, with admin consent.
            </p>
          </div>
          <label className={label}>
            Tenant ID
            <input name="tenantId" defaultValue={settings.tenantId} autoComplete="off" spellCheck={false} placeholder="00000000-0000-0000-0000-000000000000" className={`${inputClass} mt-1 font-mono`} />
            {envNote(settings.fromEnv.tenantId, 'MICROSOFT_GRAPH_TENANT_ID')}
          </label>
          <label className={label}>
            Client ID (application ID)
            <input name="clientId" defaultValue={settings.clientId} autoComplete="off" spellCheck={false} placeholder="00000000-0000-0000-0000-000000000000" className={`${inputClass} mt-1 font-mono`} />
            {envNote(settings.fromEnv.clientId, 'MICROSOFT_GRAPH_CLIENT_ID')}
          </label>
          <label className={label}>
            Client secret
            <input
              name="clientSecret"
              type="password"
              autoComplete="new-password"
              spellCheck={false}
              placeholder={settings.hasSecret ? 'Saved. Leave blank to keep it' : 'The secret’s value (not its ID)'}
              className={`${inputClass} mt-1 font-mono`}
            />
            <span className={help}>Stored encrypted and never shown again. Secrets expire in Microsoft; paste the new one here when it does.</span>
            {envNote(settings.fromEnv.clientSecret, 'MICROSOFT_GRAPH_CLIENT_SECRET')}
          </label>
          {settings.hasSecret && (
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="removeSecret" /> Remove the saved client secret
            </label>
          )}
          <label className={label}>
            Sender
            <input name="senderId" defaultValue={settings.senderId} autoComplete="off" spellCheck={false} placeholder="website@yourdomain.com" className={`${inputClass} mt-1`} />
            <span className={help}>The mailbox emails are sent from: its email address or user ID.</span>
            {envNote(settings.fromEnv.senderId, 'MICROSOFT_GRAPH_SENDER_ID')}
          </label>
          <label className={label}>
            Website address
            <input name="siteUrl" defaultValue={settings.siteUrl} placeholder="https://www.yourdomain.com" className={`${inputClass} mt-1`} />
            <span className={help}>Used for the logo and the “Open in dashboard” links in emails.</span>
          </label>
        </section>

        <section className={card}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold">Which forms are emailed, and to whom</h2>
              <p className="text-sm text-neutral-500">Separate several addresses with commas. Replies go straight to the person who filled in the form.</p>
            </div>
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input type="checkbox" name="enabled" defaultChecked={settings.enabled} /> Send form emails
            </label>
          </div>
          <ul className="divide-y divide-neutral-200 rounded-lg border border-neutral-200">
            {EMAIL_ROUTES.map(({ id, label: name }) => (
              <li key={id} className="grid gap-2 p-3 sm:grid-cols-[14rem_1fr] sm:items-center">
                <label className="flex items-center gap-2 text-sm font-semibold">
                  <input type="checkbox" name={`on-${id}`} defaultChecked={settings.routes[id].enabled} /> {name}
                </label>
                <input name={`to-${id}`} defaultValue={settings.routes[id].to} aria-label={`Send ${name} to`} placeholder="name@yourdomain.com" className={inputClass} />
              </li>
            ))}
          </ul>
        </section>

        <div className="flex flex-wrap items-center gap-4">
          <button type="submit" disabled={pending} className={submit}>
            {pending ? 'Saving…' : 'Save email settings'}
          </button>
          <Result state={state} />
        </div>
      </form>

      <form action={checkAction} className={card}>
        <div>
          <h2 className="text-lg font-bold">Check connection</h2>
          <p className="text-sm text-neutral-500">Signs in to Microsoft with a fresh token and shows what the app is allowed to do. Use it after changing permissions in Microsoft.</p>
        </div>
        <button type="submit" disabled={checking || !settings.configured} className={submit}>
          <RefreshCw className={`h-4 w-4 ${checking ? 'animate-spin' : ''}`} aria-hidden="true" /> {checking ? 'Checking…' : 'Check connection'}
        </button>
        <ConnectionResult state={checkState} />
      </form>

      <form action={testAction} className={card}>
        <div>
          <h2 className="text-lg font-bold">Send a test email</h2>
          <p className="text-sm text-neutral-500">Uses the saved settings, so save any changes first.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <input name="testTo" type="email" required placeholder="you@yourdomain.com" aria-label="Send the test to" className={`${inputClass} max-w-sm`} />
          <button type="submit" disabled={testing || !settings.configured} className={submit}>
            <Send className="h-4 w-4" aria-hidden="true" /> {testing ? 'Sending…' : 'Send test'}
          </button>
        </div>
        <Result state={testState} />
      </form>
    </div>
  );
}
