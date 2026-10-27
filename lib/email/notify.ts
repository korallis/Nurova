import 'server-only';
import { getSingle } from '@/lib/content/queries';
import { newsletterSourceLabel } from '@/lib/forms/shared';
import { sendGraphMail } from './graph';
import { parseAddresses, type EmailRoute } from './routes';
import { getEmailSettings, isConfigured, type EmailSettings } from './settings';
import { renderBrandedEmail, type BrandedEmail } from './template';

/*
 * Forwards website forms to email, alongside the dashboard Inbox. Called
 * after the submission is saved (via next/server `after`), so a slow or
 * failing mail server never affects the person filling in the form; failures
 * are only logged. Nothing is sent until Settings → Email is set up.
 */

const localTime = (date: Date) =>
  date.toLocaleString('en-GB', { timeZone: 'Europe/London', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

async function deliver(route: EmailRoute, build: (s: EmailSettings) => { subject: string; email: Omit<BrandedEmail, 'siteUrl' | 'siteName'>; replyTo?: { address: string; name?: string } }) {
  try {
    const settings = await getEmailSettings();
    const target = settings.routes[route];
    const to = parseAddresses(target.to);
    if (!settings.enabled || !target.enabled || !to.length || !isConfigured(settings)) return;
    const { siteName } = await getSingle('settings');
    const { subject, email, replyTo } = build(settings);
    await sendGraphMail(settings, { to, subject, replyTo, html: renderBrandedEmail({ ...email, siteUrl: settings.siteUrl, siteName }) });
  } catch (error) {
    console.error(`[email] Couldn’t email a ${route} submission`, error);
  }
}

export function notifyNewsletter(email: string, source: string) {
  return deliver('newsletter', (settings) => ({
    subject: `Newsletter sign-up: ${email}`,
    email: {
      eyebrow: 'Website form · Newsletter',
      heading: 'New newsletter sign-up',
      meta: [{ label: 'Received', value: localTime(new Date()) }],
      sections: [{ title: 'Sign-up', fields: [{ label: 'Email', value: email }, { label: 'Where', value: newsletterSourceLabel(source) }] }],
      button: { label: 'See all sign-ups', href: `${settings.siteUrl}/admin/inbox/newsletter` },
    },
  }));
}

/** For Settings → Email: sends a sample and reports any error, unlike the quiet notifications above. */
export async function sendTestEmail(to: string): Promise<void> {
  const settings = await getEmailSettings();
  if (!isConfigured(settings)) throw new Error('Add the tenant ID, client ID, client secret and sender first.');
  const { siteName } = await getSingle('settings');
  await sendGraphMail(settings, {
    to: [to],
    subject: `Test email from the ${siteName} website`,
    html: renderBrandedEmail({
      eyebrow: 'Test email',
      heading: 'Email forwarding is working',
      intro: 'This is how website sign-ups and messages will look when they arrive by email.',
      meta: [{ label: 'Sent', value: localTime(new Date()) }],
      sections: [
        {
          title: 'Sign-up',
          fields: [
            { label: 'Email', value: 'jane@example.com' },
            { label: 'Where', value: 'Coming-soon page' },
          ],
        },
      ],
      button: { label: 'Open the dashboard', href: `${settings.siteUrl}/admin` },
      siteUrl: settings.siteUrl,
      siteName,
    }),
  });
}
