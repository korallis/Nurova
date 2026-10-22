'use server';

import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { db, schema } from '@/lib/db';
import { createSession, deleteSession } from '@/lib/auth/session';
import { hashPassword, verifyPassword } from '@/lib/auth/password';

const MAX_FAILED_LOGINS = 5;
const LOCKOUT_MINUTES = 15;

// A real hash to compare against for unknown emails, so both paths cost the same.
let dummyHash: Promise<string> | undefined;

export interface LoginState {
  error?: string;
  email?: string;
}

/** Only allow redirects back into the dashboard (no open redirects). */
function safeNext(value: FormDataEntryValue | null) {
  const next = typeof value === 'string' ? value : '';
  return next.startsWith('/admin') && !next.startsWith('//') ? next : '/admin';
}

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const password = String(formData.get('password') ?? '');
  if (!email || !password) return { error: 'Enter your email and password.', email };

  // One message for every failure, so the form doesn't reveal which emails exist.
  const failed: LoginState = { error: 'That email and password don’t match an admin account.', email };

  const [admin] = await db().select().from(schema.adminUsers).where(eq(schema.adminUsers.email, email));
  if (!admin) {
    // Spend comparable time to a real check so timing doesn't reveal unknown emails.
    dummyHash ??= hashPassword('not-a-real-account-password');
    await verifyPassword(password, await dummyHash);
    return failed;
  }

  if (admin.lockedUntil && admin.lockedUntil > new Date()) {
    const minutes = Math.ceil((admin.lockedUntil.getTime() - Date.now()) / 60000);
    return { error: `Too many attempts. Try again in ${minutes} minute${minutes === 1 ? '' : 's'}.`, email };
  }

  if (!(await verifyPassword(password, admin.passwordHash))) {
    const failures = admin.failedLogins + 1;
    await db()
      .update(schema.adminUsers)
      .set({
        failedLogins: failures >= MAX_FAILED_LOGINS ? 0 : failures,
        lockedUntil: failures >= MAX_FAILED_LOGINS ? new Date(Date.now() + LOCKOUT_MINUTES * 60000) : null,
      })
      .where(eq(schema.adminUsers.id, admin.id));
    return failed;
  }

  await db()
    .update(schema.adminUsers)
    .set({ failedLogins: 0, lockedUntil: null, lastLoginAt: new Date() })
    .where(eq(schema.adminUsers.id, admin.id));

  await createSession(admin.id);
  redirect(safeNext(formData.get('next')));
}

export async function logout() {
  await deleteSession();
  redirect('/admin/login');
}
