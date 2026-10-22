import 'server-only';
import { cache } from 'react';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { db, schema } from '@/lib/db';
import { canAccess, isSuperAdmin, type AdminArea, type AdminRole } from './permissions';
import { readSession } from './session';

export interface CurrentAdmin {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  permissions: string[];
}

/**
 * The signed-in admin, or null. Checks the session cookie *and* that the admin
 * still exists, with their current role (so access changes apply on their next
 * request). Memoised per request.
 */
export const getCurrentAdmin = cache(async (): Promise<CurrentAdmin | null> => {
  const session = await readSession();
  if (!session) return null;
  const [admin] = await db()
    .select({
      id: schema.adminUsers.id,
      name: schema.adminUsers.name,
      email: schema.adminUsers.email,
      role: schema.adminUsers.role,
      permissions: schema.adminUsers.permissions,
    })
    .from(schema.adminUsers)
    .where(eq(schema.adminUsers.id, session.userId));
  return admin ?? null;
});

/**
 * Use at the top of every admin page, server action and route handler.
 * Redirects to the login page when there's no valid session.
 */
export async function requireAdmin(): Promise<CurrentAdmin> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect('/admin/login');
  return admin;
}

/**
 * Use at the top of every page, server action and route handler for one area
 * of the dashboard. Sends admins without access back to the overview.
 */
export async function requireAccess(area: AdminArea): Promise<CurrentAdmin> {
  const admin = await requireAdmin();
  if (!canAccess(admin, area)) redirect(`/admin?denied=${area}`);
  return admin;
}

/** For managing other admins. */
export async function requireSuperAdmin(): Promise<CurrentAdmin> {
  const admin = await requireAdmin();
  if (!isSuperAdmin(admin)) redirect('/admin?denied=admins');
  return admin;
}
