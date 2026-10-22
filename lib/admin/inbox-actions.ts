'use server';

import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';
import { db, schema } from '@/lib/db';
import { requireAccess } from '@/lib/auth/dal';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Removes someone from the newsletter list. */
export async function deleteSubscriber(id: string) {
  await requireAccess('inbox');
  if (!UUID.test(id)) return;
  await db().delete(schema.newsletterSubscribers).where(eq(schema.newsletterSubscribers.id, id));
  revalidatePath('/admin/inbox/newsletter');
}
