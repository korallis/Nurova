'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import type { BotMeta, SubmitResult } from '@/lib/forms/shared';

/**
 * Hidden anti-spam fields for a form: a honeypot people never see, and when
 * the form was first shown. Read them at submit time with `readBotMeta`.
 */
export function BotTrap() {
  const started = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (started.current && !started.current.value) started.current.value = String(Date.now());
  }, []);

  return (
    <>
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <input ref={started} type="hidden" name="startedAt" />
    </>
  );
}

export function readBotMeta(form: HTMLFormElement): BotMeta {
  const data = new FormData(form);
  return { startedAt: Number(data.get('startedAt')) || 0, website: String(data.get('website') ?? '') };
}

/**
 * Sends a form through its server action. The form must contain <BotTrap />.
 * `reference` is set once it's been received; `error` holds anything to fix.
 */
export function useFormSubmit() {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState('');
  const [reference, setReference] = useState<string | null>(null);

  const submit = (form: HTMLFormElement, send: (meta: BotMeta) => Promise<SubmitResult>) => {
    if (pending) return;
    setError('');
    const meta = readBotMeta(form);
    startTransition(async () => {
      const result: SubmitResult = await send(meta).catch(() => ({
        ok: false,
        error: 'Sorry, something went wrong sending that. Please check your connection and try again.',
      }));
      if (result.ok) setReference(result.reference);
      else setError(result.error);
    });
  };

  return { pending, error, reference, submit, reset: () => setReference(null) };
}
