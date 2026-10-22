'use client';

import { cn } from '@/lib/utils';

/** A form button for a server action that asks for confirmation first. */
export function ConfirmButton({
  action,
  confirm,
  danger = false,
  children,
}: {
  action: () => Promise<void>;
  confirm: string;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(confirm)) e.preventDefault();
      }}
    >
      <button
        type="submit"
        className={cn(
          'cursor-pointer rounded-full border px-4 py-1.5 text-xs font-bold transition',
          danger ? 'border-red-200 text-red-700 hover:bg-red-50' : 'border-neutral-300 bg-white hover:border-brand-ink'
        )}
      >
        {children}
      </button>
    </form>
  );
}
