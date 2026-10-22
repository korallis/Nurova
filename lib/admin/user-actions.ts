'use server';

import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';
import { db, schema } from '@/lib/db';
import { requireAdmin, requireSuperAdmin } from '@/lib/auth/dal';
import { hashPassword, passwordProblem, verifyPassword } from '@/lib/auth/password';
import { ADMIN_AREAS, isArea, type AdminArea, type AdminRole } from '@/lib/auth/permissions';

export interface FormState {
  error?: string;
  success?: string;
}

/** The role and ticked areas from an add/edit form. Super admins don't need areas. */
function readAccess(formData: FormData): { role: AdminRole; permissions: AdminArea[] } {
  const role: AdminRole = formData.get('role') === 'super_admin' ? 'super_admin' : 'manager';
  const permissions = [...new Set(formData.getAll('permissions').filter(isArea))];
  return { role, permissions: role === 'super_admin' ? [] : permissions };
}

const describe = ({ role, permissions }: { role: AdminRole; permissions: AdminArea[] }) =>
  role === 'super_admin'
    ? 'full access, including managing admins'
    : permissions.length
      ? permissions.map((area) => ADMIN_AREAS[area].label).join(', ')
      : 'no areas yet (they can only change their password)';

export async function createAdmin(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireSuperAdmin();
  const name = String(formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const password = String(formData.get('password') ?? '');

  if (!name) return { error: 'Add a name.' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: 'Enter a valid email address.' };
  const weak = passwordProblem(password);
  if (weak) return { error: weak };

  const [existing] = await db().select({ id: schema.adminUsers.id }).from(schema.adminUsers).where(eq(schema.adminUsers.email, email));
  if (existing) return { error: 'There’s already an admin with that email.' };

  const access = readAccess(formData);
  await db().insert(schema.adminUsers).values({ name, email, passwordHash: await hashPassword(password), ...access });
  revalidatePath('/admin/users');
  return { success: `${name} can now sign in, with ${describe(access)}.` };
}

/** Changes what another admin can do. Takes effect on their next click. */
export async function updateAccess(id: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const me = await requireSuperAdmin();
  // Nobody can demote themselves, so there's always at least one super admin.
  if (id === me.id) return { error: 'You can’t change your own access. Ask another super admin.' };
  const access = readAccess(formData);
  const [updated] = await db().update(schema.adminUsers).set(access).where(eq(schema.adminUsers.id, id)).returning({ name: schema.adminUsers.name });
  if (!updated) return { error: 'That admin no longer exists.' };
  revalidatePath('/admin/users');
  return { success: `Saved: ${updated.name} now has ${describe(access)}.` };
}

export async function deleteAdmin(id: string) {
  const me = await requireSuperAdmin();
  if (id === me.id) return;
  await db().delete(schema.adminUsers).where(eq(schema.adminUsers.id, id));
  revalidatePath('/admin/users');
}

export async function changePassword(_prev: FormState, formData: FormData): Promise<FormState> {
  const me = await requireAdmin();
  const current = String(formData.get('current') ?? '');
  const next = String(formData.get('next') ?? '');

  const [row] = await db().select().from(schema.adminUsers).where(eq(schema.adminUsers.id, me.id));
  if (!row || !(await verifyPassword(current, row.passwordHash))) return { error: 'Your current password is incorrect.' };
  const weak = passwordProblem(next);
  if (weak) return { error: weak };

  await db().update(schema.adminUsers).set({ passwordHash: await hashPassword(next) }).where(eq(schema.adminUsers.id, me.id));
  return { success: 'Password updated.' };
}
