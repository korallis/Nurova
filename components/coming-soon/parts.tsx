'use client';

import { motion } from 'motion/react';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { SOCIALS, SocialIcon } from '@/components/common/SocialLinks';
import type { SettingsContent } from '@/lib/content/pages';
import { cn } from '@/lib/utils';

/*
 * Pieces shared by the coming-soon page and the "enquiry sent" screen.
 * Sizes follow the 1920px-wide designs and scale down with the viewport.
 * Animations are switched off for people who ask for reduced motion (see the
 * MotionConfig in ComingSoon).
 */

export const focusRing = 'focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-purple';

/**
 * The brand gradient, drifting slowly. `flipped` turns it upside down (coral
 * bottom-right), as on the tall coming-soon page. It's oversized so the drift
 * never shows an edge.
 */
export function Backdrop({ flipped = false }: { flipped?: boolean }) {
  const rotate = flipped ? 180 : 0;
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute -inset-[8%] -z-10 bg-brand-purple bg-[url(/background.png)] bg-cover bg-center"
      initial={{ rotate, scale: 1.04, x: '0%', y: '0%' }}
      animate={{ rotate, scale: [1.04, 1.12, 1.04], x: ['0%', '-2.5%', '0%'], y: ['0%', '2%', '0%'] }}
      transition={{ duration: 26, ease: 'easeInOut', repeat: Infinity }}
    />
  );
}

/** Logo and tagline, the left half of the hero. The logo pops in, then floats gently. */
export function BrandLockup({ siteName, tagline }: { siteName: string; tagline: string }) {
  return (
    <Stagger onLoad delay={0.1} stagger={0.25} className="flex flex-col items-center text-center">
      <StaggerItem from="zoom">
        <motion.img
          src="/SVG/nurova2.svg"
          alt={siteName}
          width={504}
          height={429}
          className="h-auto w-[clamp(200px,26.5vw,508px)] brightness-0 invert select-none"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 6, ease: 'easeInOut', repeat: Infinity, delay: 1.2 }}
        />
      </StaggerItem>
      <StaggerItem>
        <p className="mt-[clamp(14px,2.6vw,50px)] text-balance text-[clamp(1.1rem,1.85vw,2.25rem)] leading-tight tracking-wide lg:whitespace-nowrap">{tagline}</p>
      </StaggerItem>
    </Stagger>
  );
}

/** The frosted panel on the right of the hero. It slides in on load and its contents follow one by one. */
export function GlassCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <Reveal onLoad from="right" delay={0.35} className="w-full max-w-[708px]">
      <Stagger
        onLoad
        delay={0.65}
        stagger={0.12}
        className={cn('w-full rounded-[20px] bg-white/20 p-[clamp(24px,2.5vw,48px)] shadow-[0_10px_40px_rgba(40,0,80,0.12)]', className)}
      >
        {children}
      </Stagger>
    </Reveal>
  );
}

/** White social icons; each is only a link once its URL is set in Site settings. They pop in one after another. */
export function SocialLinks({ socials, className }: { socials: SettingsContent['socials']; className?: string }) {
  return (
    <Stagger onLoad delay={1.1} stagger={0.1} className={cn('flex items-center gap-[17px]', className)}>
      {SOCIALS.map(({ key, label, icon }) => (
        <StaggerItem key={key} from="pop">
          <SocialIcon href={socials[key]} label={label} icon={icon} />
        </StaggerItem>
      ))}
    </Stagger>
  );
}

/** Two-column hero: logo on the left, a card on the right. Stacks on small screens. */
export function Hero({ lockup, card, className }: { lockup: React.ReactNode; card: React.ReactNode; className?: string }) {
  return (
    <section className={cn('mx-auto grid w-full max-w-[1544px] items-center gap-12 px-6 lg:grid-cols-2 lg:gap-[56px]', className)}>
      {lockup}
      <div className="flex justify-center lg:justify-start">{card}</div>
    </section>
  );
}

export const coralButton = cn(
  'inline-flex cursor-pointer items-center justify-center rounded-full bg-brand-coral px-[clamp(20px,1.6vw,30px)] font-bold text-white shadow-[0_6px_20px_rgba(244,93,90,0.25)] transition duration-200 ease-out',
  'hover:-translate-y-0.5 hover:brightness-105 hover:shadow-[0_10px_28px_rgba(244,93,90,0.4)] active:translate-y-0 active:scale-[0.97]',
  'disabled:cursor-default disabled:opacity-80 disabled:hover:translate-y-0 disabled:hover:shadow-none',
  focusRing
);
