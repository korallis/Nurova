/** Shared by the website forms (browser), their server actions and the dashboard Inbox. */

/** Where someone joined the newsletter, as listed in Inbox → Newsletter. */
export const NEWSLETTER_SOURCES = {
  'coming-soon': 'Coming-soon page',
} as const;

export type NewsletterSource = keyof typeof NEWSLETTER_SOURCES;

export const isNewsletterSource = (value: unknown): value is NewsletterSource =>
  typeof value === 'string' && Object.hasOwn(NEWSLETTER_SOURCES, value);

export const newsletterSourceLabel = (source: string) => (isNewsletterSource(source) ? NEWSLETTER_SOURCES[source] : source);

/** What every form's server action returns. */
export type SubmitResult = { ok: true; reference: string } | { ok: false; error: string };

/** Anti-spam values sent with every form (see BotTrap). */
export interface BotMeta {
  /** When the form was first shown (ms). */
  startedAt: number;
  /** A hidden field people never fill in. */
  website: string;
}
