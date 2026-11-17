'use client';

import { Stagger, StaggerItem } from '@/components/motion/Reveal';
import { MultiLine } from '@/components/common/MultiLine';
import { ButtonLink } from '@/components/ui/button';
import { ROUTES } from '@/constants';
import type { HomeContent } from '@/lib/content/pages';
import { cn } from '@/lib/utils';
import { Spiral, Squiggle } from './Decorations';
import { bodyText, sectionHeading } from './homeStyles';

/**
 * "Your journey to understanding starts here." The coral spiral and squiggle
 * draw themselves as the section comes into view; the squiggle runs on over
 * the top of the footer, as in the design (hence `z-10`).
 */
export function ClosingCta({ content }: { content: HomeContent['closing'] }) {
  return (
    <section aria-labelledby="closing-heading" className="relative z-10 w-full px-5 pb-6 pt-28 text-center sm:px-8 sm:pt-36 xl:u-pt-101 xl:u-pb-100">
      <Spiral className="-left-8 -top-6 w-36 sm:left-0 sm:w-48 xl:u-left-70 xl:-u-top-36 xl:u-w-400" />
      <Squiggle className="hidden md:block md:-bottom-24 md:right-4 md:w-56 xl:bottom-auto xl:right-auto xl:u-left-1340 xl:u-top-204 xl:u-w-460" />

      <Stagger stagger={0.14} className="relative mx-auto xl:u-max-w-1100">
        <StaggerItem>
          <h2 id="closing-heading" className={cn(sectionHeading, 'text-brand-coral')}>
            <MultiLine text={content.title} />
          </h2>
        </StaggerItem>
        <StaggerItem>
          <p className={cn(bodyText, 'mx-auto mt-5 max-w-2xl text-brand-purple xl:u-mt-22 xl:u-max-w-800')}>{content.body}</p>
        </StaggerItem>
        <StaggerItem className="mt-8 flex flex-wrap justify-center gap-3 xl:u-mt-28 xl:u-gap-24">
          <ButtonLink href={ROUTES.book}>{content.primaryCta}</ButtonLink>
          <ButtonLink href={ROUTES.contact} variant="outlinePurple">
            {content.secondaryCta}
          </ButtonLink>
        </StaggerItem>
      </Stagger>
    </section>
  );
}
