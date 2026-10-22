'use server';

import { after } from 'next/server';
import { notifyNewsletter } from '@/lib/email/notify';
import { db, hasDatabase, schema } from '@/lib/db';
import { getSingle } from '@/lib/content/queries';
import { isNewsletterSource, type BotMeta, type SubmitResult } from './shared';

/*
 * Server side of every website form. Input comes from the browser, so it's
 * treated as unknown: each value is read as trimmed, length-capped text and
 * checked again here.
 */

type Input = Record<string, unknown>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** Faster than this after the form appeared is a bot. */
const MIN_FILL_MS = 2500;

const obj = (value: unknown): Input => (value && typeof value === 'object' && !Array.isArray(value) ? (value as Input) : {});
const str = (value: unknown, max = 500) => (typeof value === 'string' ? value.trim().slice(0, max) : '');

function isBot(meta: unknown) {
  const m = obj(meta) as Partial<BotMeta>;
  return Boolean(str(m.website)) || !m.startedAt || Date.now() - Number(m.startedAt) < MIN_FILL_MS;
}

async function unavailable(): Promise<SubmitResult> {
  const { contact } = await getSingle('settings');
  const fallback = contact.enquiriesEmail ? `, or email us at ${contact.enquiriesEmail}` : '';
  return { ok: false, error: `Sorry, we couldn’t sign you up just now. Please try again${fallback}.` };
}

/** Newsletter sign-up (coming-soon page). Signing up twice is fine. */
export async function subscribeNewsletter(emailInput: unknown, source: unknown, meta: unknown): Promise<SubmitResult> {
  const email = str(emailInput, 254).toLowerCase();
  if (!EMAIL.test(email)) return { ok: false, error: 'Please enter a valid email address.' };
  // Bots get a quiet "thanks" so they don't learn anything.
  if (isBot(meta)) return { ok: true, reference: '' };
  if (!hasDatabase) return unavailable();
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
    return unavailable();
  }
}
