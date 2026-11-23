'use client';

import Image from 'next/image';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { MultiLine } from '@/components/common/MultiLine';
import { PageLabel } from '@/components/about/PageLabel';
import { pageText } from '@/components/about/aboutStyles';
import { ButtonLink } from '@/components/ui/button';
import { Swirl } from '@/components/home/Decorations';
import { container, gradient } from '@/components/home/homeStyles';
import type { Photo } from '@/lib/content/fields';
import { cn } from '@/lib/utils';

const TONES = {
  /** Frosted white, purple text (Quality, Children). */
  light: { panel: 'bg-white/75 text-brand-purple', primary: 'purple', secondary: 'outlinePurple' },
  /** Frosted purple, white text (Adults). */
  purple: { panel: 'bg-brand-violet/70 text-white', primary: 'coral', secondary: 'outlineWhite' },
} as const;

/**
 * A photo filling the card with a frosted panel across it holding the
 * heading, text and two buttons ("Clinical excellence you can trust.",
 * "Helping children reach their potential.").
 */
export function FrostedHero({
  id,
  label,
  title,
  body,
  image,
  tone = 'light',
  primary,
  secondary,
}: {
  id: string;
  label: string;
  title: string;
  body: string;
  image: Photo | null;
  tone?: keyof typeof TONES;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
}) {
  const t = TONES[tone];
  return (
    <section aria-labelledby={id} className={cn(container, 'mt-4 xl:u-mt-124')}>
      <PageLabel>{label}</PageLabel>
      <Reveal onLoad from="zoom" delay={0.1} className="mt-5 xl:u-mt-37">
        <div className="relative isolate flex min-h-[30rem] items-center overflow-hidden rounded-[2rem] px-4 py-10 sm:px-8 xl:u-h-762 xl:p-0 xl:u-rounded-50">
          {image?.src ? (
            <Image src={image.src} alt={image.alt} fill priority sizes="(min-width: 1280px) 90vw, 100vw" className="-z-20 object-cover" />
          ) : (
            <div aria-hidden="true" className={cn('absolute inset-0 -z-20', gradient)} />
          )}
          <Swirl delay={0.9} opacity={0.45} className="-z-10 left-[-10%] top-[-25%] w-[80%] xl:-u-left-120 xl:-u-top-180 xl:u-w-1100" />

          <Stagger
            onLoad
            delay={0.4}
            stagger={0.15}
            className={cn(
              'w-full rounded-[1.75rem] px-6 py-8 text-center shadow-[0_10px_40px_rgba(40,0,80,0.12)] backdrop-blur-md sm:px-10',
              'xl:u-ml-100 xl:u-mr-100 xl:w-[calc(100%-var(--u)*200)] xl:u-rounded-40 xl:u-px-30 xl:u-pt-45 xl:u-pb-47',
              t.panel
            )}
          >
            <StaggerItem>
              <h1 id={id} className="text-[2.2rem] font-bold leading-[1.1] sm:text-5xl xl:u-text-90 xl:u-leading-100">
                <MultiLine text={title} />
              </h1>
            </StaggerItem>
            <StaggerItem>
              <p className={cn(pageText, 'mx-auto mt-4 max-w-2xl xl:u-mt-20 xl:u-max-w-1340')}>{body}</p>
            </StaggerItem>
            <StaggerItem className="mt-7 flex flex-wrap justify-center gap-3 xl:u-mt-35 xl:u-gap-24">
              <ButtonLink href={primary.href} variant={t.primary} className="xl:u-min-w-226">
                {primary.label}
              </ButtonLink>
              <ButtonLink href={secondary.href} variant={t.secondary}>
                {secondary.label}
              </ButtonLink>
            </StaggerItem>
          </Stagger>
        </div>
      </Reveal>
    </section>
  );
}
