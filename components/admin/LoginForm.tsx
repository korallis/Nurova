'use client';

import { useActionState } from 'react';
import { Loader2, LogIn } from 'lucide-react';
import { login, type LoginState } from '@/lib/admin/auth-actions';
import { inputClass } from './MediaInputs';

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});

  return (
    <form action={action} className="mt-6 space-y-4">
      <input type="hidden" name="next" value={next} />
      <label className="block text-sm font-semibold">
        Email
        <input name="email" type="email" required autoComplete="username" defaultValue={state.email} className={`${inputClass} mt-1`} />
      </label>
      <label className="block text-sm font-semibold">
        Password
        <input name="password" type="password" required autoComplete="current-password" className={`${inputClass} mt-1`} />
      </label>
      {state.error && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-brand-coral px-5 py-2.5 text-sm font-bold text-white transition hover:brightness-95 disabled:opacity-60"
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
        {pending ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
