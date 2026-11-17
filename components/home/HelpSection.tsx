'use client';

import Image from 'next/image';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { MultiLine } from '@/components/common/MultiLine';
import { ButtonLink } from '@/components/ui/button';
import { ROUTES } from '@/constants';
import type { HomeContent } from '@/lib/content/pages';
import { cn } from '@/lib/utils';
import { Swirl } from './Decorations';
import { bodyText, container, gradient, sectionHeading } from './homeStyles';

/** "How can we help?": the gradient card rises in, its text follows and the swirl draws itself; the cut-out photo sits on the right. */
export function HelpSection({ content }: { content: HomeContent['help'] }) {
  const { image } = content;

  return (
    <section aria-labelledby="help-heading" className={cn(container, 'mt-16 sm:mt-20 xl:u-mt-104')}>
      <Reveal from="up" className="relative isolate overflow-hidden rounded-[2rem] text-white xl:u-rounded-50 xl:u-h-548">
        <div aria-hidden="true" className={cn('absolute inset-0 -z-10', gradient)} />
        <Swirl delay={0.5} strokeWidth={30} className="left-[48%] top-[-6%] w-[90%] sm:left-[45%] sm:top-0 sm:w-[70%] xl:left-[50.87%] xl:w-[44.83%]" />

        <Stagger stagger={0.13} delay={0.2} className="relative px-7 pb-10 pt-12 sm:px-12 sm:pb-14 sm:pt-16 xl:u-max-w-900 xl:u-pl-100 xl:u-pr-0 xl:u-pt-77 xl:u-pb-0">
          <StaggerItem>
            <h2 id="help-heading" className={sectionHeading}>
              <MultiLine text={content.title} />
            </h2>
          </StaggerItem>
          <StaggerItem>
            <p className="mt-6 text-xl font-medium sm:text-2xl xl:u-mt-50 xl:u-text-40 xl:u-leading-46">{content.subtitle}</p>
            <p className={cn(bodyText, 'mt-2 max-w-xl xl:u-mt-4 xl:u-max-w-680')}>{content.body}</p>
          </StaggerItem>
          <StaggerItem className="mt-8 flex flex-wrap gap-3 xl:u-mt-35 xl:u-gap-24">
            <ButtonLink href={ROUTES.book} variant="white">
              {content.primaryCta}
            </ButtonLink>
            <ButtonLink href={ROUTES.professionals} variant="outlineWhite">
              {content.secondaryCta}
            </ButtonLink>
          </StaggerItem>
        </Stagger>

        {image?.src && (
          <div className="relative mx-auto h-72 w-fit sm:h-96 xl:absolute xl:bottom-0 xl:right-0 xl:top-0 xl:h-auto">
            <Image src={image.src} alt={image.alt} width={image.width || 800} height={image.height || 800} sizes="(min-width: 1280px) 34vw, 90vw" className="h-full w-auto object-contain object-bottom" />
          </div>
        )}
      </Reveal>
    </section>
  );
}
