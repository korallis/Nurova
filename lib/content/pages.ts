/**
 * Content types for the single pages and their built-in defaults. Defaults
 * are the copy the site shipped with; they're used until a document is saved
 * in the dashboard, and seeded into the database by `bun run db:seed`.
 */

// ── Site settings ──────────────────────────────────────────────────────────

export interface SettingsContent {
  siteName: string;
  /** Shown under the logo and in browser tabs after the site name. */
  tagline: string;
  /** Default meta description for search engines. */
  description: string;
  contact: {
    /** Shown to visitors when a form can't be sent. */
    enquiriesEmail: string;
  };
  /** Leave a link empty until the account exists; its icon still shows. */
  socials: { linkedin: string; instagram: string; facebook: string };
  comingSoon: {
    title: string;
    intro: string;
    /** The button that scrolls down to the form. */
    ctaLabel: string;
    formHeading: string;
    submitLabel: string;
  };
  /** Shown in place of the coming-soon page once an enquiry is sent. */
  enquirySent: {
    heading: string;
    body: string;
    subscribeLabel: string;
    /** Shown after someone subscribes. */
    subscribedMessage: string;
  };
}

export const DEFAULT_SETTINGS: SettingsContent = {
  siteName: 'Nurova Minds',
  tagline: 'Understanding Minds. Transforming Lives.',
  description: 'Nurova Minds: ADHD and autism assessments and support. Understanding minds, transforming lives. Our website is launching soon.',
  contact: {
    enquiriesEmail: '',
  },
  socials: { linkedin: '', instagram: '', facebook: '' },
  comingSoon: {
    title: 'We’re Launching Very Soon.',
    intro:
      'If you’re exploring an ADHD or autism assessment for yourself or someone you support, or you’d like to discuss professional referral pathways, we’d love to hear from you.',
    ctaLabel: 'Get in touch',
    formHeading: 'Get in touch',
    submitLabel: 'Send enquiry',
  },
  enquirySent: {
    heading: 'We’ll be in touch with you soon!',
    body: 'Thank you for getting in touch with Nurova Minds. We’ve received your enquiry and will email you about the next steps.',
    subscribeLabel: 'Subscribe',
    subscribedMessage: 'Thanks for subscribing! We’ll keep you posted.',
  },
};
