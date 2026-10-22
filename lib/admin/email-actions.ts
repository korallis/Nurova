'use server';

import { revalidatePath } from 'next/cache';
import { requireSuperAdmin } from '@/lib/auth/dal';
import { EMAIL_ROUTES, parseAddresses, type EmailRoute } from '@/lib/email/routes';
import { getEmailSettings, isConfigured, saveEmailSettings, type RouteSetting } from '@/lib/email/settings';
import { checkConnection, type ConnectionCheck } from '@/lib/email/graph';
import { sendTestEmail } from '@/lib/email/notify';

export interface EmailFormState {
  error?: string;
  success?: string;
}

const field = (formData: FormData, name: string, max = 300) => String(formData.get(name) ?? '').trim().slice(0, max);

/** Settings → Email. Super admins only. */
export async function saveEmailSettingsAction(_prev: EmailFormState, formData: FormData): Promise<EmailFormState> {
  const me = await requireSuperAdmin();

  const siteUrl = field(formData, 'siteUrl').replace(/\/+$/, '');
  if (siteUrl && !/^https?:\/\/[^\s/]+\.[^\s/]+/.test(siteUrl)) return { error: 'The website address should look like https://www.example.com.' };

  const routes = {} as Record<EmailRoute, RouteSetting>;
  for (const { id, label } of EMAIL_ROUTES) {
    const to = field(formData, `to-${id}`, 1000);
    const enabled = formData.get(`on-${id}`) === 'on';
    if (enabled && !parseAddresses(to).length) return { error: `Add at least one email address for ${label}, or switch it off.` };
    routes[id] = { enabled, to };
  }

  await saveEmailSettings(
    {
      enabled: formData.get('enabled') === 'on',
      tenantId: field(formData, 'tenantId'),
      clientId: field(formData, 'clientId'),
      clientSecret: field(formData, 'clientSecret', 500),
      removeSecret: formData.get('removeSecret') === 'on',
      senderId: field(formData, 'senderId'),
      siteUrl,
      routes,
    },
    me.id
  );
  revalidatePath('/admin/settings');
  return { success: 'Email settings saved.' };
}

export interface ConnectionState {
  checkedAt?: string;
  result?: ConnectionCheck;
  /** Links for fixing a missing permission, built from the saved tenant and client IDs. */
  links?: { permissions: string; consent: string };
  error?: string;
}

/** "Check connection": a fresh sign-in to Microsoft, reporting the app's granted permissions. */
export async function checkConnectionAction(): Promise<ConnectionState> {
  await requireSuperAdmin();
  const settings = await getEmailSettings();
  if (!isConfigured(settings)) return { error: 'Add and save the tenant ID, client ID, client secret and sender first.' };
  const result = await checkConnection(settings);
  const tenant = encodeURIComponent(settings.tenantId);
  const client = encodeURIComponent(settings.clientId);
  return {
    checkedAt: new Date().toLocaleTimeString('en-GB', { timeZone: 'Africa/Johannesburg' }),
    result,
    links: {
      permissions: `https://entra.microsoft.com/#view/Microsoft_AAD_RegisteredApps/ApplicationMenuBlade/~/CallAnAPI/appId/${client}`,
      consent: `https://login.microsoftonline.com/${tenant}/adminconsent?client_id=${client}`,
    },
  };
}

export async function sendTestEmailAction(_prev: EmailFormState, formData: FormData): Promise<EmailFormState> {
  await requireSuperAdmin();
  const [to] = parseAddresses(field(formData, 'testTo', 254));
  if (!to) return { error: 'Enter the email address to send the test to.' };
  try {
    await sendTestEmail(to);
    return { success: `Test email sent to ${to}. It can take a minute to arrive; check junk mail too.` };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'The test email couldn’t be sent.' };
  }
}
