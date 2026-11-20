'use client';

import { Stagger, StaggerItem } from '@/components/motion/Reveal';
import { MultiLine } from '@/components/common/MultiLine';
import { ButtonLink } from '@/components/ui/button';
import { ROUTES } from '@/constants';
import { cn } from '@/lib/utils';
import { Spiral, Squiggle } from './Decorations';
import { bodyText, sectionHeading } from './homeStyles';

/** The two colourways in the designs: Home (coral) and About (purple, with pink strokes). */
const TONES = {
  coral: { heading: 'text-brand-coral', primary: 'coral', stroke: 'var(--color-brand-coral)', bodyWidth: 'max-w-2xl xl:u-max-w-800' },
  purple: { heading: 'text-brand-purple', primary: 'violet', stroke: 'var(--color-brand-pink)', bodyWidth: 'max-w-md xl:u-max-w-430' },
} as const;

/**
 * The closing call to action ("Your journey to understanding starts here.",
 * "Ready to take the next step?"). The spiral and squiggle draw themselves as
 * the section comes into view; the squiggle runs on over the top of the
 * footer, as in the designs (hence `z-10`).
 */
export function ClosingCta({
  content,
  tone = 'coral',
}: {
  content: { title: string; body: string; primaryCta: string; secondaryCta: string };
  tone?: keyof typeof TONES;
}) {
  const t = TONES[tone];
  return (
    <section aria-labelledby="closing-heading" className="relative z-10 w-full px-5 pb-6 pt-28 text-center sm:px-8 sm:pt-36 xl:u-pt-101 xl:u-pb-100">
      <Spiral color={t.stroke} className="-left-8 -top-6 w-36 sm:left-0 sm:w-48 xl:u-left-70 xl:-u-top-36 xl:u-w-400" />
      <Squiggle color={t.stroke} className="hidden md:block md:-bottom-24 md:right-4 md:w-56 xl:bottom-auto xl:right-auto xl:u-left-1340 xl:u-top-204 xl:u-w-460" />

      <Stagger stagger={0.14} className="relative mx-auto xl:u-max-w-1100">
        <StaggerItem>
          <h2 id="closing-heading" className={cn(sectionHeading, t.heading)}>
            <MultiLine text={content.title} />
          </h2>
        </StaggerItem>
        <StaggerItem>
          <p className={cn(bodyText, 'mx-auto mt-5 text-brand-purple xl:u-mt-22', t.bodyWidth)}>{content.body}</p>
        </StaggerItem>
        <StaggerItem className="mt-8 flex flex-wrap justify-center gap-3 xl:u-mt-28 xl:u-gap-24">
          <ButtonLink href={ROUTES.book} variant={t.primary}>
            {content.primaryCta}
          </ButtonLink>
          <ButtonLink href={ROUTES.contact} variant="outlinePurple" className={tone === 'purple' ? 'xl:u-min-w-228' : undefined}>
            {content.secondaryCta}
          </ButtonLink>
        </StaggerItem>
      </Stagger>
    </section>
  );
}
