'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { changePassword, createAdmin, updateAccess, type FormState } from '@/lib/admin/user-actions';
import { MIN_PASSWORD_LENGTH } from '@/lib/auth/password-rules';
import { ADMIN_AREAS, AREA_KEYS, ROLE_LABELS, type AdminRole } from '@/lib/auth/permissions';
import { inputClass } from './MediaInputs';

function Result({ state }: { state: FormState }) {
  if (state.error) return <p role="alert" className="text-sm font-semibold text-red-600">{state.error}</p>;
  if (state.success) return <p role="status" className="text-sm font-semibold text-green-700">{state.success}</p>;
  return null;
}

const card = 'space-y-4 rounded-xl border border-neutral-200 bg-white p-5';
const field = 'block text-sm font-semibold';
const submit = 'cursor-pointer rounded-full bg-brand-coral px-5 py-2 text-sm font-bold text-white hover:brightness-95 disabled:opacity-60';

/** Role picker plus, for managers, the dashboard areas they can use. */
function AccessFields({ initialRole = 'manager', initialPermissions = ['content', 'blog'] }: { initialRole?: AdminRole; initialPermissions?: string[] }) {
  const [role, setRole] = useState<AdminRole>(initialRole);

  return (
    <div className="space-y-3">
      <fieldset>
        <legend className={field}>Role</legend>
        <div className="mt-1 flex flex-wrap gap-4 text-sm">
          {(Object.keys(ROLE_LABELS) as AdminRole[]).map((value) => (
            <label key={value} className="inline-flex cursor-pointer items-center gap-2">
              <input type="radio" name="role" value={value} checked={role === value} onChange={() => setRole(value)} />
              {ROLE_LABELS[value]}
            </label>
          ))}
        </div>
      </fieldset>

      {role === 'manager' ? (
        <fieldset>
          <legend className={field}>Can manage</legend>
          <div className="mt-1 space-y-1.5">
            {AREA_KEYS.map((area) => (
              <label key={area} className="flex cursor-pointer items-start gap-2 text-sm">
                <input type="checkbox" name="permissions" value={area} defaultChecked={initialPermissions.includes(area)} className="mt-1" />
                <span>
                  <span className="font-semibold">{ADMIN_AREAS[area].label}</span>
                  <span className="block text-xs text-neutral-500">{ADMIN_AREAS[area].help}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      ) : (
        <p className="text-xs text-neutral-500">Super admins can use every part of the dashboard and give or remove other people’s access.</p>
      )}
    </div>
  );
}

/** Change another admin's role and areas (super admins only). */
export function EditAccessForm({ id, role, permissions }: { id: string; role: AdminRole; permissions: string[] }) {
  const [state, action, pending] = useActionState<FormState, FormData>(updateAccess.bind(null, id), {});

  return (
    <form action={action} className="space-y-3 border-t border-neutral-200 pt-3">
      <AccessFields initialRole={role} initialPermissions={permissions} />
      <Result state={state} />
      <button type="submit" disabled={pending} className={submit}>
        {pending ? 'Saving…' : 'Save access'}
      </button>
    </form>
  );
}

export function AddAdminForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(createAdmin, {});
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={action} className={card}>
      <h2 className="text-lg font-bold">Add someone</h2>
      <label className={field}>
        Name
        <input name="name" required className={`${inputClass} mt-1`} />
      </label>
      <label className={field}>
        Email
        <input name="email" type="email" required className={`${inputClass} mt-1`} />
      </label>
      <label className={field}>
        Temporary password
        <input name="password" type="password" required minLength={MIN_PASSWORD_LENGTH} autoComplete="new-password" className={`${inputClass} mt-1`} />
        <span className="mt-1 block text-xs font-normal text-neutral-500">
          At least {MIN_PASSWORD_LENGTH} characters. Share it securely; they can change it after signing in.
        </span>
      </label>
      <AccessFields />
      <Result state={state} />
      <button type="submit" disabled={pending} className={submit}>
        {pending ? 'Adding…' : 'Add'}
      </button>
    </form>
  );
}

export function ChangePasswordForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(changePassword, {});
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={action} className={card}>
      <h2 className="text-lg font-bold">Change your password</h2>
      <label className={field}>
        Current password
        <input name="current" type="password" required autoComplete="current-password" className={`${inputClass} mt-1`} />
      </label>
      <label className={field}>
        New password
        <input name="next" type="password" required minLength={MIN_PASSWORD_LENGTH} autoComplete="new-password" className={`${inputClass} mt-1`} />
      </label>
      <Result state={state} />
      <button type="submit" disabled={pending} className={submit}>
        {pending ? 'Updating…' : 'Update password'}
      </button>
    </form>
  );
}
