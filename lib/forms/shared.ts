/** Shared by the website forms (browser), their server actions and the dashboard Inbox. */
import type { FormKind, SubmissionStatus } from '@/lib/db/schema';

/** Each form's inbox in the dashboard. `prefix` starts its reference numbers. */
export const INBOXES: Record<FormKind, { label: string; description: string; prefix: string; path: string }> = {
  enquiry: { label: 'Enquiries', description: 'Messages from the “Get in touch” form.', prefix: 'NV-E', path: '/coming-soon' },
};

export const FORM_KINDS = Object.keys(INBOXES) as FormKind[];

export const SUBMISSION_STATUS_LABELS: Record<SubmissionStatus, string> = {
  open: 'Open',
  resolved: 'Resolved',
  archived: 'Archived',
};

// ── Enquiry form choices ───────────────────────────────────────────────────

/** "I'm enquiring…": pick one. */
export const ENQUIRER_TYPES = {
  myself: 'For myself',
  'someone-i-support': 'For my child or someone I support',
  professional: 'As a professional or on behalf of an organisation',
} as const;

export type EnquirerType = keyof typeof ENQUIRER_TYPES;

/** "What can we help with?": pick any, plus an optional "Something else". */
export const HELP_TOPICS = {
  adhd: 'ADHD assessment',
  autism: 'Autism assessment',
  combined: 'Combined ADHD and autism assessment',
  'post-diagnosis': 'Support after diagnosis',
  professional: 'Professional referrals and partnerships',
} as const;

export type HelpTopic = keyof typeof HELP_TOPICS;

export interface EnquiryInput {
  name: string;
  email: string;
  phone: string;
  organisation: string;
  enquirer: EnquirerType | '';
  topics: HelpTopic[];
  somethingElse: string;
  message: string;
}

// ── Newsletter ─────────────────────────────────────────────────────────────

/** Where someone joined the newsletter, as listed in Inbox → Newsletter. */
export const NEWSLETTER_SOURCES = {
  'coming-soon': 'Coming-soon page',
  'enquiry-confirmation': 'After sending an enquiry',
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
