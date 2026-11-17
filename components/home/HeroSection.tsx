'use client';

import Image from 'next/image';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { MultiLine } from '@/components/common/MultiLine';
import { ButtonLink } from '@/components/ui/button';
import { ROUTES } from '@/constants';
import type { HomeContent } from '@/lib/content/pages';
import { cn } from '@/lib/utils';
import { Swirl } from './Decorations';
import { container, displayHeading, gradient } from './homeStyles';

/**
 * "Clarity starts here." The card zooms in on load, its text follows line by
 * line and the swirl draws itself. The photo (a cut-out, set in the dashboard)
 * stands on the bottom of the card on the right; from `xl` up its head rises
 * above the card, as in the design.
 */
export function HeroSection({ content }: { content: HomeContent['hero'] }) {
  const { image } = content;

  return (
    <section aria-labelledby="hero-heading" className={cn(container, 'mt-2 sm:mt-4 xl:u-mt-123')}>
      <Reveal onLoad from="zoom" className="relative">
        <div className="relative isolate overflow-hidden rounded-[2rem] text-white xl:u-rounded-50 xl:u-h-609">
          <div aria-hidden="true" className={cn('absolute inset-0 -z-10', gradient)} />
          <Swirl delay={0.9} className="left-[30%] top-[-3%] w-[100%] sm:left-[42%] sm:w-[70%] xl:left-[45.93%] xl:top-[-1.64%] xl:w-[54.65%]" />

          <Stagger onLoad delay={0.35} stagger={0.15} className="relative px-7 pb-10 pt-12 sm:px-12 sm:pb-14 sm:pt-16 xl:u-max-w-1000 xl:u-pl-100 xl:u-pr-0 xl:u-pt-78 xl:u-pb-0">
            <StaggerItem>
              <h1 id="hero-heading" className={displayHeading}>
                <MultiLine text={content.title} />
              </h1>
            </StaggerItem>
            <StaggerItem>
              <p className="mt-5 max-w-xl text-base leading-relaxed sm:text-xl sm:leading-relaxed xl:u-mt-38 xl:u-max-w-800 xl:u-text-30 xl:u-leading-45">{content.body}</p>
            </StaggerItem>
            <StaggerItem className="mt-8 flex flex-wrap gap-3 xl:u-mt-52 xl:u-gap-24">
              <ButtonLink href={ROUTES.book} variant="white">
                {content.primaryCta}
              </ButtonLink>
              <ButtonLink href={ROUTES.professionals} variant="outlineWhite">
                {content.secondaryCta}
              </ButtonLink>
            </StaggerItem>
          </Stagger>

          {/* Below `xl` the photo stands at the bottom of the card, under the text. */}
          {image?.src && (
            <div className="relative mx-auto -mt-2 h-72 w-fit sm:h-96 xl:hidden">
              <Image src={image.src} alt={image.alt} width={image.width || 800} height={image.height || 800} sizes="90vw" className="h-full w-auto object-contain object-bottom" />
            </div>
          )}
        </div>

        {/* From `xl` up the photo sits outside the card's clipping so its head can rise above it. */}
        {image?.src && (
          <Reveal onLoad from="up" delay={0.5} className="pointer-events-none absolute bottom-0 hidden xl:block xl:u-right-28 xl:u-h-732">
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width || 800}
              height={image.height || 800}
              sizes="(min-width: 1280px) 42vw, 1px"
              priority
              className="h-full w-auto object-contain object-bottom"
            />
          </Reveal>
        )}
      </Reveal>
    </section>
  );
}
