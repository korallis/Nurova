'use client';

import Image from 'next/image';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { MultiLine } from '@/components/common/MultiLine';
import { ButtonLink } from '@/components/ui/button';
import { Swirl } from '@/components/home/Decorations';
import { container, gradient } from '@/components/home/homeStyles';
import { ROUTES } from '@/constants';
import type { AboutContent } from '@/lib/content/pages';
import { cn } from '@/lib/utils';
import { PageLabel } from './PageLabel';

/**
 * The coral label, then "We're here to help people understand themselves."
 * in the gradient card, as on the home page: the card zooms in on load, its
 * text follows and the swirl draws itself. The cut-out photo (set in the
 * dashboard) stands on the bottom of the card; from `xl` up its head rises above it.
 */
export function AboutHero({
  content,
  primaryHref = ROUTES.book,
  secondaryHref = ROUTES.contact,
  headingId = 'about-heading',
}: {
  content: Pick<AboutContent['hero'], 'label' | 'title' | 'body' | 'image' | 'primaryCta' | 'secondaryCta'>;
  primaryHref?: string;
  secondaryHref?: string;
  headingId?: string;
}) {
  const { image } = content;

  return (
    <section aria-labelledby={headingId} className={cn(container, 'mt-4 xl:u-mt-124')}>
      <PageLabel>{content.label}</PageLabel>

      <Reveal onLoad from="zoom" delay={0.1} className="relative mt-5 xl:u-mt-37">
        <div className="relative isolate overflow-hidden rounded-[2rem] text-white xl:u-rounded-50 xl:u-h-762">
          <div aria-hidden="true" className={cn('absolute inset-0 -z-10', gradient)} />
          <Swirl delay={0.9} className="left-[30%] top-[-3%] w-[100%] sm:left-[42%] sm:w-[70%] xl:left-[37.8%] xl:top-[-1%] xl:w-[42.6%]" />

          <Stagger onLoad delay={0.4} stagger={0.15} className="relative px-7 pb-10 pt-12 sm:px-12 sm:pb-14 sm:pt-16 xl:u-max-w-1200 xl:u-pl-100 xl:u-pr-0 xl:u-pt-77 xl:u-pb-0">
            <StaggerItem>
              <h1 id={headingId} className="text-[2.4rem] font-bold leading-[1.05] sm:text-6xl xl:u-text-90 xl:u-leading-115">
                <MultiLine text={content.title} />
              </h1>
            </StaggerItem>
            <StaggerItem>
              <p className="mt-5 max-w-xl text-base leading-relaxed sm:text-xl sm:leading-relaxed xl:u-mt-24 xl:u-max-w-640 xl:u-text-30 xl:u-leading-45">{content.body}</p>
            </StaggerItem>
            <StaggerItem className="mt-8 flex flex-wrap gap-3 xl:u-mt-61 xl:u-gap-24">
              <ButtonLink href={primaryHref} variant="whitePurple">
                {content.primaryCta}
              </ButtonLink>
              <ButtonLink href={secondaryHref} variant="outlineWhite">
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
          <Reveal onLoad from="up" delay={0.5} className="pointer-events-none absolute bottom-0 right-0 hidden xl:block xl:u-h-796">
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width || 800}
              height={image.height || 800}
              sizes="(min-width: 1280px) 48vw, 1px"
              priority
              className="h-full w-auto object-contain object-bottom"
            />
          </Reveal>
        )}
      </Reveal>
    </section>
  );
}
