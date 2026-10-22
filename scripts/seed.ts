/**
 * Copies the site's built-in content into the database so it can be edited
 * in the dashboard.
 *
 *   bun run db:seed            # only fills in what's missing
 *   bun run db:seed -- --force # overwrites saved content with the built-in copy
 */
import { config } from 'dotenv';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { sql } from 'drizzle-orm';
import * as schema from '../lib/db/schema';
import { SINGLES, type SingleKey } from '../lib/content/registry';

config({ path: ['.env.local', '.env'] });

async function main() {
  if (!process.env.DATABASE_URL) throw new Error('Set DATABASE_URL in .env.local first (see .env.example).');
  const force = process.argv.includes('--force');
  const db = drizzle(neon(process.env.DATABASE_URL), { schema });

  const rows = (Object.keys(SINGLES) as SingleKey[]).map((key) => ({ key, data: SINGLES[key].defaults as unknown }));

  const insert = db.insert(schema.content).values(rows);
  const content = force
    ? await insert.onConflictDoUpdate({ target: schema.content.key, set: { data: sql`excluded.data`, updatedAt: new Date() } }).returning({ key: schema.content.key })
    : await insert.onConflictDoNothing().returning({ key: schema.content.key });
  console.log(`Content: ${content.length} of ${rows.length} documents ${force ? 'written' : 'added (existing ones kept)'}.`);
}

main().then(
  () => process.exit(0),
  (error) => {
    console.error(error);
    process.exit(1);
  }
);
