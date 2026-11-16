'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';
import { db, schema } from '@/lib/db';
import { requireAccess } from '@/lib/auth/dal';
import { INBOXES, SUBMISSION_STATUS_LABELS } from '@/lib/forms/shared';
import type { FormKind, SubmissionStatus } from '@/lib/db/schema';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type UpdateSubmissionState = { ok?: boolean; error?: string; savedAt?: string };

/** Saves a message's status and the team's notes. */
export async function updateSubmission(id: string, _prev: UpdateSubmissionState, formData: FormData): Promise<UpdateSubmissionState> {
  await requireAccess('inbox');
  if (!UUID.test(id)) return { error: 'Unknown message.' };
  const status = String(formData.get('status') ?? '');
  if (!Object.hasOwn(SUBMISSION_STATUS_LABELS, status)) return { error: 'Choose a status.' };
  const notes = String(formData.get('notes') ?? '').slice(0, 10000);

  await db()
    .update(schema.formSubmissions)
    .set({ status: status as SubmissionStatus, notes, updatedAt: new Date() })
    .where(eq(schema.formSubmissions.id, id));
  revalidatePath('/admin', 'layout');
  return { ok: true, savedAt: new Date().toISOString() };
}

/** Marks a message unread again, e.g. to come back to it. */
export async function markUnread(id: string, form: FormKind) {
  await requireAccess('inbox');
  if (!UUID.test(id) || !Object.hasOwn(INBOXES, form)) return;
  await db().update(schema.formSubmissions).set({ readAt: null }).where(eq(schema.formSubmissions.id, id));
  revalidatePath('/admin', 'layout');
  redirect(`/admin/inbox/${form}`);
}

/** Deletes a message for good. */
export async function deleteSubmission(id: string, form: FormKind) {
  await requireAccess('inbox');
  if (!UUID.test(id) || !Object.hasOwn(INBOXES, form)) return;
  await db().delete(schema.formSubmissions).where(eq(schema.formSubmissions.id, id));
  revalidatePath('/admin', 'layout');
  redirect(`/admin/inbox/${form}`);
}

/** Removes someone from the newsletter list. */
export async function deleteSubscriber(id: string) {
  await requireAccess('inbox');
  if (!UUID.test(id)) return;
  await db().delete(schema.newsletterSubscribers).where(eq(schema.newsletterSubscribers.id, id));
  revalidatePath('/admin/inbox/newsletter');
}
