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
    heading: string;
    buttonLabel: string;
    /** Shown in place of the form after someone subscribes. */
    successMessage: string;
  };
}

export const DEFAULT_SETTINGS: SettingsContent = {
  siteName: 'Nurova',
  tagline: 'Understanding Minds. Transforming Lives.',
  description: 'Nurova: understanding minds, transforming lives. Our website is launching soon.',
  contact: {
    enquiriesEmail: '',
  },
  socials: { linkedin: '', instagram: '', facebook: '' },
  comingSoon: {
    heading: 'Launching Soon',
    buttonLabel: 'Subscribe',
    successMessage: 'Thanks for subscribing! We’ll let you know when we launch.',
  },
};
