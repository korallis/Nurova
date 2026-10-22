'use client';

import { useState, useTransition } from 'react';
import { BotTrap, readBotMeta } from '@/components/forms/BotTrap';
import { subscribeNewsletter } from '@/lib/forms/submit';
import type { SettingsContent } from '@/lib/content/pages';

const SOCIALS = [
  { key: 'linkedin', label: 'LinkedIn', icon: '/icons/linkedin.svg' },
  { key: 'instagram', label: 'Instagram', icon: '/icons/instagram.svg' },
  { key: 'facebook', label: 'Facebook', icon: '/icons/facebook.svg' },
] as const;

const focusRing = 'focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-purple';

/** A white social icon; only a link once its URL is set in Site settings. */
function SocialIcon({ href, label, icon }: { href: string; label: string; icon: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  const image = <img src={icon} alt="" width={38} height={38} className="h-[38px] w-[38px]" />;
  if (!href) return <span aria-hidden="true">{image}</span>;
  return (
    <a href={href} aria-label={label} target="_blank" rel="noopener noreferrer" className={`rounded-full transition-transform hover:scale-110 ${focusRing}`}>
      {image}
    </a>
  );
}

/**
 * The pre-launch page (see next.config.ts). Every word on it comes from Site
 * settings in the dashboard; sign-ups are listed under Inbox → Newsletter.
 */
export function ComingSoon({ settings }: { settings: SettingsContent }) {
  const { siteName, tagline, socials, comingSoon } = settings;
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
      const result = await subscribeNewsletter(email, 'coming-soon', meta).catch(() => ({ ok: false as const, error: 'Sorry, that didn’t work. Please try again.' }));
      if (result.ok) setSubscribed(true);
      else setError(result.error);
    });
  };

  return (
    <main className="relative flex min-h-svh w-full flex-col items-center justify-center overflow-hidden bg-brand-purple bg-[url('/background.png')] bg-cover bg-center px-6 py-12 text-white">
      {/* Sizes follow the 1920×1080 design, scaling down on smaller screens. */}
      <h1 className="sr-only">{siteName}</h1>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo-stacked.svg"
        alt={siteName}
        width={504}
        height={339}
        className="h-auto w-[clamp(200px,27.6vw,530px)] brightness-0 invert select-none"
      />

      <p className="mt-[clamp(14px,2.3vh,26px)] text-center text-[clamp(1.1rem,2.08vw,2.5rem)] leading-tight tracking-wide text-balance">{tagline}</p>

      <h2 className="mt-[clamp(18px,3.2vh,36px)] text-center text-[clamp(1.9rem,3.2vw,3.85rem)] font-bold leading-tight">{comingSoon.heading}</h2>

      <form onSubmit={handleSubmit} className="relative mt-[clamp(24px,3.8vh,42px)] h-[50px] w-[min(598px,100%)]">
        <label htmlFor="email" className="sr-only">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          readOnly={subscribed}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          aria-invalid={Boolean(error)}
          aria-describedby="subscribe-status"
          className={`h-full w-full rounded-full bg-white pl-6 pr-36 text-[17px] font-medium text-[#333] placeholder:text-[#BDBDBD] ${focusRing}`}
        />
        <button
          type="submit"
          disabled={pending || subscribed}
          className={`absolute right-0 top-0 h-full min-w-[130px] cursor-pointer rounded-full bg-brand-coral px-5 text-[18px] font-bold text-white transition hover:brightness-95 disabled:cursor-default disabled:opacity-90 ${focusRing}`}
        >
          {subscribed ? 'Subscribed' : pending ? 'Sending…' : comingSoon.buttonLabel}
        </button>
        <BotTrap />
        <p id="subscribe-status" role={error ? 'alert' : 'status'} className="absolute inset-x-0 top-full mt-2 text-center text-sm font-medium">
          {error || (subscribed ? comingSoon.successMessage : '')}
        </p>
      </form>

      <div className="mt-[clamp(40px,5vh,56px)] flex items-center gap-[17px]">
        {SOCIALS.map(({ key, label, icon }) => (
          <SocialIcon key={key} href={socials[key]} label={label} icon={icon} />
        ))}
      </div>
    </main>
  );
}
