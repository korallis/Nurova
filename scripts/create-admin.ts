/**
 * Creates a dashboard super admin (or resets an existing admin's password,
 * leaving their role as it is). Managers are added from the dashboard's Admins page.
 *
 *   bun run admin:create
 *   bun run admin:create -- --email you@example.com --name "Your Name"
 *
 * The password is always typed at the prompt so it never lands in your shell history.
 */
import { config } from 'dotenv';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import * as schema from '../lib/db/schema';
import { hashPassword, passwordProblem } from '../lib/auth/password';

config({ path: ['.env.local', '.env'] });

function arg(name: string) {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : undefined;
}

/** Reads a line without echoing it (for the password). */
async function askHidden(question: string): Promise<string> {
  stdout.write(question);
  const wasRaw = stdin.isRaw;
  if (stdin.isTTY) stdin.setRawMode(true);
  stdin.resume();
  let value = '';
  return new Promise((resolve) => {
    const onData = (chunk: Buffer) => {
      for (const char of chunk.toString('utf8')) {
        if (char === '\r' || char === '\n') {
          stdin.off('data', onData);
          if (stdin.isTTY) stdin.setRawMode(wasRaw);
          stdin.pause();
          stdout.write('\n');
          resolve(value);
          return;
        }
        if (char === '\u0003') process.exit(1); // Ctrl+C
        if (char === '\u007f' || char === '\b') value = value.slice(0, -1);
        else value += char;
      }
    };
    stdin.on('data', onData);
  });
}

async function main() {
  if (!process.env.DATABASE_URL) throw new Error('Set DATABASE_URL in .env.local first (see .env.example).');
  const db = drizzle(neon(process.env.DATABASE_URL), { schema });

  const rl = createInterface({ input: stdin, output: stdout });
  const email = (arg('email') ?? (await rl.question('Email: '))).trim().toLowerCase();
  const name = (arg('name') ?? (await rl.question('Name: '))).trim();
  rl.close();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('That email address looks wrong.');
  if (!name) throw new Error('A name is required.');

  const password = await askHidden('Password: ');
  const problem = passwordProblem(password);
  if (problem) throw new Error(problem);
  if ((await askHidden('Repeat password: ')) !== password) throw new Error('The passwords don’t match.');

  const passwordHash = await hashPassword(password);
  const [existing] = await db.select({ id: schema.adminUsers.id }).from(schema.adminUsers).where(eq(schema.adminUsers.email, email));
  if (existing) {
    await db.update(schema.adminUsers).set({ name, passwordHash, failedLogins: 0, lockedUntil: null }).where(eq(schema.adminUsers.id, existing.id));
    console.log(`Updated ${email}. They can sign in at /admin/login with the new password.`);
  } else {
    await db.insert(schema.adminUsers).values({ email, name, passwordHash, role: 'super_admin' });
    console.log(`Created super admin ${email}. Sign in at /admin/login.`);
  }
}

main().then(
  () => process.exit(0),
  (error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
);
