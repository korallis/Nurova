'use client';

import { useState, useTransition } from 'react';
import { motion } from 'motion/react';
import { BotTrap, readBotMeta } from '@/components/forms/BotTrap';
import { subscribeNewsletter } from '@/lib/forms/submit';
import type { NewsletterSource } from '@/lib/forms/shared';
import { cn } from '@/lib/utils';
import { coralButton, focusRing } from './parts';

/** Email box with a Subscribe button inside it. Sign-ups are listed under Inbox → Newsletter. */
export function NewsletterForm({ source, buttonLabel, successMessage, className }: { source: NewsletterSource; buttonLabel: string; successMessage: string; className?: string }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');
  const [pending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim() || pending || subscribed) return;
    setError('');
    const meta = readBotMeta(e.currentTarget);
    startTransition(async () => {
      const result = await subscribeNewsletter(email, source, meta).catch(() => ({ ok: false as const, error: 'Sorry, that didn’t work. Please try again.' }));
      if (result.ok) setSubscribed(true);
      else setError(result.error);
    });
  };

  return (
    <form onSubmit={handleSubmit} className={cn('relative h-[50px] w-full', className)}>
      <label htmlFor={`newsletter-${source}`} className="sr-only">
        Email
      </label>
      <input
        id={`newsletter-${source}`}
        type="email"
        required
        autoComplete="email"
        value={email}
        readOnly={subscribed}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        aria-invalid={Boolean(error)}
        aria-describedby={`newsletter-${source}-status`}
        className={cn('h-full w-full rounded-full bg-white pl-6 pr-36 text-[17px] font-medium text-[#333] placeholder:text-[#BDBDBD]', focusRing)}
      />
      <button type="submit" disabled={pending || subscribed} className={cn(coralButton, 'absolute right-0 top-0 h-full min-w-[130px] text-[clamp(1rem,1.2vw,1.4rem)]')}>
        {subscribed ? 'Subscribed' : pending ? 'Sending…' : buttonLabel}
      </button>
      <BotTrap />
      {/* The live region stays put so screen readers announce changes; only the text inside animates. */}
      <p id={`newsletter-${source}-status`} role={error ? 'alert' : 'status'} className="absolute inset-x-0 top-full mt-2 text-sm font-medium">
        {(error || subscribed) && (
          <motion.span key={error || 'subscribed'} className="block" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            {error || successMessage}
          </motion.span>
        )}
      </p>
    </form>
  );
}
