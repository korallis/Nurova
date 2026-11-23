'use client';

import { Stagger, StaggerItem } from '@/components/motion/Reveal';
import { MultiLine } from '@/components/common/MultiLine';
import { ButtonLink, type ButtonVariant } from '@/components/ui/button';
import { ROUTES } from '@/constants';
import { cn } from '@/lib/utils';
import { Spiral, Squiggle, WaveLeft, WaveRight } from './Decorations';
import { bodyText, sectionHeading } from './homeStyles';

const CORAL = 'var(--color-brand-coral)';
const PINK = 'var(--color-brand-pink)';
const VIOLET = 'var(--color-brand-violet)';

/** The strokes either side of the heading; positions are design units from the section's top-left. */
const STROKES = {
  spiralAndSquiggle: (left: string, right: string) => (
    <>
      <Spiral color={left} className="-left-8 -top-6 w-36 sm:left-0 sm:w-48 xl:u-left-70 xl:-u-top-36 xl:u-w-400" />
      <Squiggle color={right} className="hidden md:block md:-bottom-24 md:right-4 md:w-56 xl:bottom-auto xl:right-auto xl:u-left-1340 xl:u-top-204 xl:u-w-460" />
    </>
  ),
  /** Swapped sides, the spiral turned so its tail runs down into the footer. */
  squiggleAndSpiral: (left: string, right: string) => (
    <>
      <Squiggle color={left} className="-left-6 -top-4 w-36 sm:left-0 sm:w-48 xl:u-left-180 xl:u-top-26 xl:u-w-460" />
      <Spiral color={right} className="hidden -rotate-90 md:block md:-bottom-20 md:right-4 md:w-52 xl:bottom-auto xl:right-auto xl:u-left-1374 xl:u-top-227 xl:u-w-360" />
    </>
  ),
  waves: (left: string, right: string) => (
    <>
      <WaveLeft color={left} className="-left-6 -top-2 w-36 sm:left-0 sm:w-48 xl:u-left-100 xl:u-top-51 xl:u-w-460" />
      <WaveRight color={right} className="hidden md:block md:-bottom-24 md:right-0 md:w-60 xl:bottom-auto xl:right-auto xl:u-left-1210 xl:u-top-51 xl:u-w-580" />
    </>
  ),
};

/** Each design's colourway. */
const VARIANTS = {
  home: { heading: 'text-brand-coral', primary: 'coral', strokes: 'spiralAndSquiggle', colors: [CORAL, CORAL], bodyWidth: 'max-w-2xl xl:u-max-w-800' },
  about: { heading: 'text-brand-purple', primary: 'violet', strokes: 'spiralAndSquiggle', colors: [PINK, PINK], bodyWidth: 'max-w-md xl:u-max-w-430' },
  quality: { heading: 'text-brand-purple', primary: 'violet', strokes: 'squiggleAndSpiral', colors: [VIOLET, VIOLET], bodyWidth: 'max-w-md xl:u-max-w-430' },
  team: { heading: 'text-brand-purple', primary: 'coral', strokes: 'waves', colors: [CORAL, CORAL], bodyWidth: 'max-w-2xl xl:u-max-w-800' },
  /** The five assessment pages: their stroke colours come from the page (the `colors` prop). */
  assessment: { heading: 'text-brand-purple', primary: 'violet', strokes: 'spiralAndSquiggle', colors: [PINK, PINK], bodyWidth: 'max-w-md xl:u-max-w-500' },
  /** The adult and children assessment pages. */
  hub: { heading: 'text-brand-purple', primary: 'violet', strokes: 'squiggleAndSpiral', colors: [CORAL, CORAL], bodyWidth: 'max-w-2xl xl:u-max-w-800' },
} satisfies Record<string, { heading: string; primary: ButtonVariant; strokes: keyof typeof STROKES; colors: [string, string]; bodyWidth: string }>;

/**
 * The closing call to action at the bottom of each page ("Your journey to
 * understanding starts here.", "Ready to take the next step?"). The strokes
 * draw themselves as the section comes into view; the right-hand one runs on
 * over the top of the footer, as in the designs (hence `z-10`).
 */
export function ClosingCta({
  content,
  variant = 'home',
  colors,
}: {
  content: { title: string; body: string; primaryCta: string; secondaryCta: string };
  variant?: keyof typeof VARIANTS;
  /** Left and right stroke colours, overriding the variant's. */
  colors?: [string, string];
}) {
  const v = VARIANTS[variant];
  const [left, right] = colors ?? v.colors;
  return (
    <section aria-labelledby="closing-heading" className="relative z-10 w-full px-5 pb-6 pt-28 text-center sm:px-8 sm:pt-36 xl:u-pt-101 xl:u-pb-100">
      {STROKES[v.strokes](left, right)}

      <Stagger stagger={0.14} className="relative mx-auto xl:u-max-w-1100">
        <StaggerItem>
          <h2 id="closing-heading" className={cn(sectionHeading, v.heading)}>
            <MultiLine text={content.title} />
          </h2>
        </StaggerItem>
        <StaggerItem>
          <p className={cn(bodyText, 'mx-auto mt-5 text-brand-purple xl:u-mt-22', v.bodyWidth)}>
            <MultiLine text={content.body} />
          </p>
        </StaggerItem>
        <StaggerItem className="mt-8 flex flex-wrap justify-center gap-3 xl:u-mt-28 xl:u-gap-24">
          <ButtonLink href={ROUTES.book} variant={v.primary}>
            {content.primaryCta}
          </ButtonLink>
          <ButtonLink href={ROUTES.contact} variant="outlinePurple" className="xl:u-min-w-228">
            {content.secondaryCta}
          </ButtonLink>
        </StaggerItem>
      </Stagger>
    </section>
  );
}
