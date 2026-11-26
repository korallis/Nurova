'use client';

import Image from 'next/image';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { MultiLine } from '@/components/common/MultiLine';
import { PageLabel } from '@/components/about/PageLabel';
import { pageHeading, pageText } from '@/components/about/aboutStyles';
import { ButtonLink } from '@/components/ui/button';
import { Swirl } from '@/components/home/Decorations';
import { container, gradient } from '@/components/home/homeStyles';
import type { Photo } from '@/lib/content/fields';
import { cn } from '@/lib/utils';

/**
 * The coral label, then the gradient card (762 design px tall) with the
 * heading, text and two buttons on the left and a cut-out photo on the right
 * (Right to Choose, Support). Where the photo sits differs per design, so the
 * page passes its box classes; below `xl` it sits under the text.
 */
export function GradientHero({
  id,
  label,
  title,
  body,
  bodyWidth,
  primary,
  secondary,
  image,
  imageClassName,
  cardClassName,
  swirlClassName = 'xl:u-left-860 xl:u-top-0 xl:u-w-940',
}: {
  /** The heading's id. */
  id: string;
  label: string;
  title: string;
  body: string;
  /** Max width of the text from `xl` up, e.g. `xl:u-max-w-660`. */
  bodyWidth: string;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
  image: Photo | null;
  /** The photo's box: its size and position. Its height sets the photo's size. */
  imageClassName: string;
  /** Extra classes for the card, e.g. a square corner where the photo runs into it. */
  cardClassName?: string;
  /** The swirl's box from `xl` up, measured from each design. */
  swirlClassName?: string;
}) {
  return (
    <section aria-labelledby={id} className={cn(container, 'mt-4 xl:u-mt-124')}>
      <PageLabel>{label}</PageLabel>
      <Reveal onLoad from="zoom" delay={0.1} className="mt-5 xl:u-mt-39">
        <div className={cn('relative isolate flex flex-col overflow-hidden rounded-[2rem] text-white xl:u-h-762 xl:flex-row xl:items-center xl:u-rounded-50', cardClassName)}>
          <div aria-hidden="true" className={cn('absolute inset-0 -z-20', gradient)} />
          <Swirl delay={0.9} className={cn('-z-10 left-[30%] top-[-3%] w-[100%] sm:left-[42%] sm:w-[70%]', swirlClassName)} />

          <Stagger onLoad delay={0.4} stagger={0.15} className="relative z-10 px-7 pb-10 pt-12 sm:px-12 sm:pb-14 sm:pt-16 xl:u-pl-100 xl:u-pr-0 xl:py-0">
            <StaggerItem>
              <h1 id={id} className={cn(pageHeading, 'xl:u-leading-113')}>
                <MultiLine text={title} />
              </h1>
            </StaggerItem>
            <StaggerItem>
              <p className={cn(pageText, 'mt-5 max-w-xl xl:u-mt-21 xl:max-w-none', bodyWidth)}>{body}</p>
            </StaggerItem>
            <StaggerItem className="mt-8 flex flex-wrap gap-3 xl:u-mt-59 xl:u-gap-24">
              <ButtonLink href={primary.href} variant="whitePurple">
                {primary.label}
              </ButtonLink>
              <ButtonLink href={secondary.href} variant="outlineWhite">
                {secondary.label}
              </ButtonLink>
            </StaggerItem>
          </Stagger>

          {image?.src && (
            <Reveal onLoad from="up" delay={0.5} className={cn('pointer-events-none relative w-fit xl:absolute xl:mx-0', imageClassName)}>
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width || 800}
                height={image.height || 800}
                priority
                sizes="(min-width: 1280px) 60vw, 90vw"
                className="h-full w-auto object-contain object-bottom"
              />
            </Reveal>
          )}
        </div>
      </Reveal>
    </section>
  );
}
