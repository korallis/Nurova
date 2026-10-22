import type { Metadata } from 'next';
import { asc } from 'drizzle-orm';
import { db, schema } from '@/lib/db';
import { requireAdmin } from '@/lib/auth/dal';
import { ADMIN_AREAS, ROLE_LABELS, isArea, isSuperAdmin, type AccessHolder } from '@/lib/auth/permissions';
import { deleteAdmin } from '@/lib/admin/user-actions';
import { ConfirmButton } from '@/components/admin/ConfirmButton';
import { AddAdminForm, ChangePasswordForm, EditAccessForm } from '@/components/admin/UserForms';
import { cn } from '@/lib/utils';

export const metadata: Metadata = { title: 'Admins' };

const chip = 'rounded-full px-2 py-0.5 text-[11px] font-bold';

/** Role badge and, for managers, the areas they can use. */
function AccessSummary({ admin }: { admin: AccessHolder }) {
  if (isSuperAdmin(admin)) return <span className={cn(chip, 'bg-brand-ink text-white')}>{ROLE_LABELS.super_admin}</span>;
  const areas = admin.permissions.filter(isArea);
  return (
    <span className="flex flex-wrap items-center gap-1.5">
      <span className={cn(chip, 'bg-brand-coral text-white')}>{ROLE_LABELS.manager}</span>
      {areas.length === 0 && <span className="text-xs text-neutral-500">No areas yet</span>}
      {areas.map((area) => (
        <span key={area} className={cn(chip, 'bg-neutral-100 text-neutral-700')}>
          {ADMIN_AREAS[area].label}
        </span>
      ))}
    </span>
  );
}

export default async function UsersPage() {
  const me = await requireAdmin();

  // Managers only see their own account.
  if (!isSuperAdmin(me)) {
    return (
      <div className="space-y-10">
        <header>
          <h1 className="text-2xl font-bold sm:text-3xl">Your account</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {me.name} · {me.email}
          </p>
        </header>
        <section className="space-y-2">
          <h2 className="text-sm font-bold uppercase tracking-wide text-neutral-500">Your access</h2>
          <AccessSummary admin={me} />
          <p className="text-xs text-neutral-500">A super admin can give you access to more of the dashboard.</p>
        </section>
        <div className="max-w-md">
          <ChangePasswordForm />
        </div>
      </div>
    );
  }

  const admins = await db()
    .select({
      id: schema.adminUsers.id,
      name: schema.adminUsers.name,
      email: schema.adminUsers.email,
      role: schema.adminUsers.role,
      permissions: schema.adminUsers.permissions,
      lastLoginAt: schema.adminUsers.lastLoginAt,
    })
    .from(schema.adminUsers)
    .orderBy(asc(schema.adminUsers.createdAt));

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-2xl font-bold sm:text-3xl">Admins</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Super admins can do everything, including giving and removing access. Managers can only use the areas ticked for them.
        </p>
      </header>

      <ul className="divide-y divide-neutral-200 rounded-xl border border-neutral-200 bg-white">
        {admins.map((admin) => (
          <li key={admin.id} className="space-y-3 px-4 py-3">
            <div className="flex flex-wrap items-center gap-4">
              <span className="min-w-0 flex-1">
                <span className="block font-semibold">
                  {admin.name} {admin.id === me.id && <span className="text-xs font-normal text-neutral-500">(you)</span>}
                </span>
                <span className="block text-xs text-neutral-500">{admin.email}</span>
              </span>
              <AccessSummary admin={admin} />
              <span className="text-xs text-neutral-500">
                {admin.lastLoginAt ? `Last signed in ${admin.lastLoginAt.toLocaleDateString('en-GB')}` : 'Never signed in'}
              </span>
              {admin.id !== me.id && (
                <ConfirmButton action={deleteAdmin.bind(null, admin.id)} confirm={`Remove ${admin.name}? They’ll be signed out straight away.`} danger>
                  Remove
                </ConfirmButton>
              )}
            </div>
            {admin.id !== me.id && (
              <details className="group">
                <summary className="cursor-pointer text-sm font-semibold text-brand-coral hover:underline">Edit access</summary>
                <div className="mt-2 max-w-md">
                  <EditAccessForm id={admin.id} role={admin.role} permissions={admin.permissions} />
                </div>
              </details>
            )}
          </li>
        ))}
      </ul>

      <div className="grid gap-6 md:grid-cols-2">
        <AddAdminForm />
        <ChangePasswordForm />
      </div>
    </div>
  );
}
