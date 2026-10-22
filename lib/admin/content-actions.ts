'use server';

import { redirect } from 'next/navigation';
import { updateTag } from 'next/cache';
import { eq } from 'drizzle-orm';
import { db, schema } from '@/lib/db';
import { requireAccess } from '@/lib/auth/dal';
import { contentArea } from '@/lib/auth/permissions';
import { ContentValidationError, validate } from '@/lib/content/fields';
import { SINGLES, contentTag, isSingleKey } from '@/lib/content/registry';

export type SaveResult = { ok: true; savedAt: string } | { ok: false; errors: string[] };

/** Validates and stores one document. `data` comes from the dashboard editor. */
export async function saveContent(key: string, data: unknown): Promise<SaveResult> {
  const admin = await requireAccess(contentArea(key));
  if (!isSingleKey(key)) return { ok: false, errors: ['Unknown content.'] };

  let clean: unknown;
  try {
    clean = validate(SINGLES[key].schema, data);
  } catch (error) {
    if (error instanceof ContentValidationError) return { ok: false, errors: error.issues };
    throw error;
  }

  const now = new Date();
  await db()
    .insert(schema.content)
    .values({ key, data: clean, updatedAt: now, updatedBy: admin.id })
    .onConflictDoUpdate({ target: schema.content.key, set: { data: clean, updatedAt: now, updatedBy: admin.id } });

  updateTag(contentTag.single(key));
  return { ok: true, savedAt: now.toISOString() };
}

/** Throws away saved changes to a page, going back to the built-in copy. */
export async function resetContent(key: string) {
  await requireAccess(contentArea(key));
  if (!isSingleKey(key)) return;
  await db().delete(schema.content).where(eq(schema.content.key, key));
  updateTag(contentTag.single(key));
  redirect(`/admin/content/${key}`);
}
