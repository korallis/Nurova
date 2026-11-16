'use client';

import { useActionState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { updateSubmission, type UpdateSubmissionState } from '@/lib/admin/inbox-actions';
import { SUBMISSION_STATUS_LABELS } from '@/lib/forms/shared';
import type { SubmissionStatus } from '@/lib/db/schema';
import { inputClass } from './MediaInputs';

/** Status and internal notes for one Inbox message. */
export function SubmissionStatusForm({ id, status, notes }: { id: string; status: SubmissionStatus; notes: string }) {
  const [state, action, pending] = useActionState<UpdateSubmissionState, FormData>(updateSubmission.bind(null, id), {});

  return (
    <form action={action} className="space-y-4 rounded-xl border border-neutral-200 bg-white p-4">
      <label className="block text-sm font-semibold text-brand-ink">
        Status
        <select name="status" defaultValue={status} className={`${inputClass} mt-1.5`}>
          {(Object.keys(SUBMISSION_STATUS_LABELS) as SubmissionStatus[]).map((s) => (
            <option key={s} value={s}>
              {SUBMISSION_STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm font-semibold text-brand-ink">
        Notes
        <span className="block text-xs font-normal text-neutral-500">Only the team can see these.</span>
        <textarea name="notes" defaultValue={notes} rows={6} maxLength={10000} className={`${inputClass} mt-1.5`} />
      </label>
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-brand-coral px-5 py-2 text-sm font-bold text-white hover:brightness-95 disabled:opacity-60"
        >
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} Save
        </button>
        <span role="status" className="text-xs text-neutral-500">
          {state.error ?? (state.ok && state.savedAt ? `Saved ${new Date(state.savedAt).toLocaleTimeString('en-GB')}` : '')}
        </span>
      </div>
    </form>
  );
}
