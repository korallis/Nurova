import type { Metadata } from 'next';
import { requireSuperAdmin } from '@/lib/auth/dal';
import { getEmailSettings, isConfigured } from '@/lib/email/settings';
import { EmailSettingsForm } from '@/components/admin/EmailSettingsForm';

export const metadata: Metadata = { title: 'Settings' };

/** Super admins only: the Microsoft email connection and where each form is sent. */
export default async function SettingsPage() {
  await requireSuperAdmin();
  const s = await getEmailSettings();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold sm:text-3xl">Email settings</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Forward website forms to Microsoft 365 mailboxes as branded emails. Everything still arrives in the dashboard Inbox too.
        </p>
      </header>
      <EmailSettingsForm
        settings={{
          enabled: s.enabled,
          // Values that come from environment variables aren't echoed back into the form.
          tenantId: s.fromEnv.tenantId ? '' : s.tenantId,
          clientId: s.fromEnv.clientId ? '' : s.clientId,
          senderId: s.fromEnv.senderId ? '' : s.senderId,
          siteUrl: s.siteUrl,
          hasSecret: Boolean(s.clientSecret) && !s.fromEnv.clientSecret,
          secretUnreadable: s.secretUnreadable,
          configured: isConfigured(s),
          fromEnv: s.fromEnv,
          routes: s.routes,
        }}
      />
    </div>
  );
}
