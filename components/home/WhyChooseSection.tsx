'use client';

import { Stagger, StaggerItem } from '@/components/motion/Reveal';
import { MultiLine } from '@/components/common/MultiLine';
import { ButtonLink } from '@/components/ui/button';
import { ROUTES } from '@/constants';
import type { HomeContent } from '@/lib/content/pages';
import { cn } from '@/lib/utils';
import { bodyText, container, sectionHeading } from './homeStyles';

/** "Why families and individuals choose Nurova Minds": heading, text and button rise in one after another. */
export function WhyChooseSection({ content }: { content: HomeContent['whyChoose'] }) {
  return (
    <section aria-labelledby="why-heading" className={cn(container, 'mt-16 text-center text-brand-violet sm:mt-20 xl:u-mt-98')}>
      <Stagger stagger={0.14}>
        <StaggerItem>
          <h2 id="why-heading" className={sectionHeading}>
            <MultiLine text={content.title} />
          </h2>
        </StaggerItem>
        <StaggerItem>
          <p className={cn(bodyText, 'mx-auto mt-5 max-w-3xl xl:u-mt-26 xl:u-max-w-1230')}>{content.body}</p>
        </StaggerItem>
        <StaggerItem from="pop" className="mt-7 xl:u-mt-25">
          <ButtonLink href={ROUTES.book} variant="violet">
            {content.cta}
          </ButtonLink>
        </StaggerItem>
      </Stagger>
    </section>
  );
}
