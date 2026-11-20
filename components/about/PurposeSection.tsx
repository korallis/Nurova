'use client';

import { Stagger, StaggerItem } from '@/components/motion/Reveal';
import { MultiLine } from '@/components/common/MultiLine';
import { ButtonLink } from '@/components/ui/button';
import { bodyText, container, sectionHeading } from '@/components/home/homeStyles';
import { ROUTES } from '@/constants';
import type { AboutContent } from '@/lib/content/pages';
import { cn } from '@/lib/utils';

/** "Our purpose, ambitions and values": heading, text and button rise in one after another. */
export function PurposeSection({ content }: { content: AboutContent['purpose'] }) {
  return (
    <section aria-labelledby="purpose-heading" className={cn(container, 'mt-16 text-center text-brand-violet sm:mt-20 xl:u-mt-100')}>
      <Stagger stagger={0.14}>
        <StaggerItem>
          <h2 id="purpose-heading" className={sectionHeading}>
            <MultiLine text={content.title} />
          </h2>
        </StaggerItem>
        <StaggerItem>
          <p className={cn(bodyText, 'mx-auto mt-5 max-w-3xl xl:u-mt-22 xl:u-max-w-1100')}>{content.body}</p>
        </StaggerItem>
        <StaggerItem from="pop" className="mt-7 xl:u-mt-29">
          <ButtonLink href={ROUTES.ourApproach} variant="violet" className="xl:u-min-w-226">
            {content.cta}
          </ButtonLink>
        </StaggerItem>
      </Stagger>
    </section>
  );
}
