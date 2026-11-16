'use server';

import { randomBytes } from 'node:crypto';
import { after } from 'next/server';
import { and, eq, gt } from 'drizzle-orm';
import { notifyNewsletter, notifySubmission } from '@/lib/email/notify';
import { db, hasDatabase, schema } from '@/lib/db';
import { getSingle } from '@/lib/content/queries';
import type { FormKind, SubmissionSection } from '@/lib/db/schema';
import { ENQUIRER_TYPES, HELP_TOPICS, INBOXES, isNewsletterSource, type BotMeta, type HelpTopic, type SubmitResult } from './shared';

/*
 * Server side of every website form. Input comes from the browser, so it's
 * treated as unknown: each value is read as trimmed, length-capped text and
 * the required fields are checked again here. Answers are stored as labelled
 * sections so the dashboard Inbox can show any form.
 */

type Input = Record<string, unknown>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** Faster than this after the form appeared is a bot. */
const MIN_FILL_MS = 2500;
/** A second identical submission within this window returns the first reference (double clicks). */
const DUPLICATE_WINDOW_MS = 2 * 60 * 1000;

const obj = (value: unknown): Input => (value && typeof value === 'object' && !Array.isArray(value) ? (value as Input) : {});
const str = (value: unknown, max = 500) => (typeof value === 'string' ? value.trim().slice(0, max) : '');

function reference(form: FormKind) {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return `${INBOXES[form].prefix}-${Array.from(randomBytes(6), (b) => alphabet[b % alphabet.length]).join('')}`;
}

/** Drops empty answers and empty sections. */
function sections(...parts: { title: string; fields: [string, string][] }[]): SubmissionSection[] {
  return parts
    .map(({ title, fields }) => ({ title, fields: fields.filter(([, v]) => v).map(([label, value]) => ({ label, value })) }))
    .filter((s) => s.fields.length);
}

function isBot(meta: unknown) {
  const m = obj(meta) as Partial<BotMeta>;
  return Boolean(str(m.website)) || !m.startedAt || Date.now() - Number(m.startedAt) < MIN_FILL_MS;
}

async function unavailable(what = 'send your message'): Promise<SubmitResult> {
  const { contact } = await getSingle('settings');
  const fallback = contact.enquiriesEmail ? `, or email us at ${contact.enquiriesEmail}` : '';
  return { ok: false, error: `Sorry, we couldn’t ${what} just now. Please try again${fallback}.` };
}

interface Submission {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  answers: SubmissionSection[];
}

async function save(form: FormKind, meta: unknown, submission: Submission | string): Promise<SubmitResult> {
  // A validation message from the form's checks.
  if (typeof submission === 'string') return { ok: false, error: submission };
  // Bots get a quiet "thanks" so they don't learn anything.
  if (isBot(meta)) return { ok: true, reference: reference(form) };
  if (!hasDatabase) return unavailable();

  try {
    const [recent] = await db()
      .select({ reference: schema.formSubmissions.reference })
      .from(schema.formSubmissions)
      .where(
        and(
          eq(schema.formSubmissions.form, form),
          eq(schema.formSubmissions.email, submission.email),
          eq(schema.formSubmissions.subject, submission.subject),
          gt(schema.formSubmissions.createdAt, new Date(Date.now() - DUPLICATE_WINDOW_MS))
        )
      )
      .limit(1);
    if (recent) return { ok: true, reference: recent.reference };

    const ref = reference(form);
    const [saved] = await db()
      .insert(schema.formSubmissions)
      .values({ form, reference: ref, name: submission.name, email: submission.email, phone: submission.phone ?? '', subject: submission.subject, answers: submission.answers })
      .returning({ id: schema.formSubmissions.id, createdAt: schema.formSubmissions.createdAt });
    // Also forward it by email, after the response so it never slows or fails the form.
    after(() => notifySubmission({ form, reference: ref, phone: '', ...submission, ...saved }));
    return { ok: true, reference: ref };
  } catch (error) {
    console.error(`[forms] Couldn’t save a ${form} submission`, error);
    return unavailable();
  }
}

// ── The forms ──────────────────────────────────────────────────────────────

/** "Get in touch" on the coming-soon page. */
export async function submitEnquiry(data: unknown, meta: unknown): Promise<SubmitResult> {
  const d = obj(data);
  const name = str(d.name, 120);
  const email = str(d.email, 254).toLowerCase();
  const phone = str(d.phone, 40);
  const organisation = str(d.organisation, 200);
  const enquirerKey = str(d.enquirer, 40);
  const enquirer = Object.hasOwn(ENQUIRER_TYPES, enquirerKey) ? ENQUIRER_TYPES[enquirerKey as keyof typeof ENQUIRER_TYPES] : '';
  const topics = (Array.isArray(d.topics) ? d.topics : [])
    .filter((t): t is HelpTopic => typeof t === 'string' && Object.hasOwn(HELP_TOPICS, t))
    .map((t) => HELP_TOPICS[t]);
  const somethingElse = str(d.somethingElse, 300);
  const message = str(d.message, 6000);

  const problem =
    (!name ? 'Please enter your full name.' : null) ??
    (!EMAIL.test(email) ? 'Please enter a valid email address.' : null) ??
    (!enquirer ? 'Please tell us who you’re enquiring for.' : null) ??
    (topics.length === 0 && !somethingElse ? 'Please choose what we can help with, or describe it under “Something else”.' : null);

  const helpWith = [...topics, ...(somethingElse ? [`Something else: ${somethingElse}`] : [])];

  return save(
    'enquiry',
    meta,
    problem ?? {
      name,
      email,
      phone,
      subject: `${topics[0] ?? 'Enquiry'}${topics.length > 1 ? ` + ${topics.length - 1} more` : ''} · ${enquirer}`.slice(0, 200),
      answers: sections(
        { title: 'Contact details', fields: [['Full name', name], ['Email', email], ['Phone', phone], ['Organisation', organisation]] },
        { title: 'Enquiry', fields: [['Enquiring', enquirer], ['Help with', helpWith.join('\n')], ['Message', message]] }
      ),
    }
  );
}

/** Newsletter sign-up. Signing up twice is fine. */
export async function subscribeNewsletter(emailInput: unknown, source: unknown, meta: unknown): Promise<SubmitResult> {
  const email = str(emailInput, 254).toLowerCase();
  if (!EMAIL.test(email)) return { ok: false, error: 'Please enter a valid email address.' };
  if (isBot(meta)) return { ok: true, reference: '' };
  if (!hasDatabase) return unavailable('sign you up');
  try {
    const where = isNewsletterSource(source) ? source : 'coming-soon';
    const added = await db()
      .insert(schema.newsletterSubscribers)
      .values({ email, source: where })
      .onConflictDoNothing({ target: schema.newsletterSubscribers.email })
      .returning({ id: schema.newsletterSubscribers.id });
    // Only new sign-ups are emailed (when that's switched on in Settings → Email).
    if (added.length) after(() => notifyNewsletter(email, where));
    return { ok: true, reference: '' };
  } catch (error) {
    console.error('[forms] Couldn’t save a newsletter sign-up', error);
    return unavailable('sign you up');
  }
}
