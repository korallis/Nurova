/**
 * Editor schemas for every editable document. Each schema mirrors a content
 * type (lib/content/pages.ts) and is used both to build the dashboard form and
 * to validate saves.
 */
import { list, object, optional, photo, text, textarea, type Field } from './fields';

const heading = (label = 'Heading') => textarea(label, { rows: 2, help: 'A line break starts a new line on larger screens.' });
const body = (label = 'Text') => textarea(label, { rows: 4 });

// ── Single pages ───────────────────────────────────────────────────────────

export const settingsSchema: Field = object({
  siteName: text('Site name'),
  tagline: text('Tagline', { help: 'Shown under the logo on the coming-soon page and in browser tabs after the site name.' }),
  description: textarea('Search engine description', { rows: 2 }),
  contact: object(
    {
      enquiriesEmail: text('Enquiries email', { help: 'Shown to visitors if a form can’t be sent, and where enquiry emails go by default.' }),
      phone: text('Phone (as displayed)'),
      phoneInternational: text('Phone (international, for tap-to-call)', { placeholder: '+44 808 175 4091' }),
    },
    'Contact details'
  ),
  address: object({ heading: text('Heading'), lines: list('Address lines', text('Line')) }, 'Office address', 'Shown in the footer.'),
  socials: object(
    { linkedin: text('LinkedIn URL'), instagram: text('Instagram URL'), facebook: text('Facebook URL') },
    'Social links',
    'Leave a link empty until the account exists; its icon still shows, but isn’t clickable.'
  ),
  footerCredit: text('Footer credit line', { help: 'Shown after “© year site name”.' }),
  comingSoon: object(
    {
      title: text('Heading'),
      intro: textarea('Introduction', { rows: 3 }),
      ctaLabel: text('Button label', { help: 'The button that scrolls down to the form.' }),
      formHeading: text('Form heading'),
      submitLabel: text('Send button label'),
    },
    'Coming-soon page'
  ),
  enquirySent: object(
    {
      heading: text('Heading'),
      body: textarea('Message', { rows: 3 }),
      subscribeLabel: text('Subscribe button label'),
      subscribedMessage: text('Message after subscribing'),
    },
    'After sending an enquiry',
    'Shown in place of the coming-soon page once someone sends the form.'
  ),
});

const cutOut = (label: string, help: string) => optional(label, photo('Photo', 'Use a PNG or WebP with a transparent background.'), help);

export const homeSchema: Field = object({
  hero: object(
    {
      title: heading(),
      body: body(),
      image: cutOut('Photo', 'A cut-out photo standing on the bottom of the card, on the right. Its head can rise above the card.'),
      primaryCta: text('Main button label'),
      secondaryCta: text('“For Professionals” button label'),
    },
    'Hero'
  ),
  quote: object({ text: heading('Quote'), body: body(), cta: text('Button label') }, 'Quote'),
  assessments: list(
    'Assessment cards',
    object({ title: heading('Title'), body: body(), href: text('“Learn More” link', { placeholder: '/assessments/adhd' }) }),
    { itemTitle: 'title', min: 1, help: 'The carousel under the quote.' }
  ),
  whyChoose: object({ title: heading(), body: body(), cta: text('Button label') }, 'Why families and individuals choose us'),
  journey: object(
    {
      title: heading(),
      steps: list('Steps', text('Step'), { min: 1 }),
      image: optional('Photo', photo('Photo'), 'Shown on the left, with the brand swirl over it.'),
      cta: text('Button label'),
      linkLabel: text('Link label'),
    },
    'Assessment journey'
  ),
  help: object(
    {
      title: heading(),
      subtitle: text('Subheading'),
      body: body(),
      image: cutOut('Photo', 'A cut-out photo on the right of the card.'),
      primaryCta: text('Main button label'),
      secondaryCta: text('“For Professionals” button label'),
    },
    'How can we help?'
  ),
  afterAssessment: object({ title: heading(), body: body(), cta: text('Button label') }, 'More than an assessment'),
  faq: object(
    { title: heading(), body: textarea('Questions', { rows: 4, help: 'A line break starts a new line on larger screens.' }), cta: text('Button label') },
    'Frequently asked questions'
  ),
  closing: object(
    { title: heading(), body: body(), primaryCta: text('Main button label'), secondaryCta: text('Second button label') },
    'Closing call to action'
  ),
});
