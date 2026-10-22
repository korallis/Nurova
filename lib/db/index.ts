import 'server-only';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

/** Whether a database is configured. Without one the public site runs on built-in content. */
export const hasDatabase = Boolean(process.env.DATABASE_URL);

// Neon's HTTP driver: one short request per query, suited to serverless functions on Vercel.
function createDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set. Add your Neon connection string to .env.local (see .env.example).');
  }
  return drizzle(neon(process.env.DATABASE_URL), { schema });
}

let instance: ReturnType<typeof createDb> | undefined;

/** Lazily created so builds and pages without a database don't fail at import time. */
export function db() {
  instance ??= createDb();
  return instance;
}

export { schema };
