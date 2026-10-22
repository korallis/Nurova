/**
 * Editor schemas for every editable document. Each schema mirrors a content
 * type (lib/content/pages.ts) and is used both to build the dashboard form and
 * to validate saves.
 */
import { object, text, textarea, type Field } from './fields';

// ── Single pages ───────────────────────────────────────────────────────────

export const settingsSchema: Field = object({
  siteName: text('Site name'),
  tagline: text('Tagline', { help: 'Shown under the logo on the coming-soon page and in browser tabs after the site name.' }),
  description: textarea('Search engine description', { rows: 2 }),
  contact: object(
    { enquiriesEmail: text('Enquiries email', { help: 'Shown to visitors if a form can’t be sent.' }) },
    'Contact details'
  ),
  socials: object(
    { linkedin: text('LinkedIn URL'), instagram: text('Instagram URL'), facebook: text('Facebook URL') },
    'Social links',
    'Leave a link empty until the account exists; its icon still shows, but isn’t clickable.'
  ),
  comingSoon: object(
    {
      heading: text('Heading'),
      buttonLabel: text('Subscribe button label'),
      successMessage: text('Message after subscribing'),
    },
    'Coming-soon page'
  ),
});
