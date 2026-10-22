import 'server-only';
import { unstable_cache } from 'next/cache';
import { eq } from 'drizzle-orm';
import { db, hasDatabase, schema } from '@/lib/db';
import { withDefaults } from './fields';
import { SINGLES, contentTag, type SingleKey, type SingleTypes } from './registry';

/*
 * Read side of the CMS. Everything is cached with a tag (see contentTag) and
 * refreshed when the dashboard saves. With no DATABASE_URL, or if the database
 * can't be reached, pages fall back to the built-in defaults so the site
 * always renders.
 */

async function safely<T>(what: string, run: () => Promise<T>, fallback: T): Promise<T> {
  if (!hasDatabase) return fallback;
  try {
    return await run();
  } catch (error) {
    console.error(`[content] Couldn't load ${what}; using built-in content.`, error);
    return fallback;
  }
}

/**
 * Part of the content cache keys (one per document). Bump it when a content type changes shape
 * so cached copies in the old shape aren't served (they outlive deploys).
 */
const SHAPE_VERSION = '1';

/** A single page's content (e.g. `home`), merged over its defaults. */
export function getSingle<K extends SingleKey>(key: K): Promise<SingleTypes[K]> {
  const defaults = SINGLES[key].defaults;
  return unstable_cache(
    () =>
      safely(
        key,
        async () => {
          const [row] = await db().select({ data: schema.content.data }).from(schema.content).where(eq(schema.content.key, key));
          return withDefaults(row?.data, defaults);
        },
        defaults
      ),
    ['content', key, SHAPE_VERSION],
    { tags: [contentTag.single(key)] }
  )();
}
