'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { LongArrow } from '@/components/common/LongArrow';
import { MultiLine } from '@/components/common/MultiLine';
import { ButtonLink } from '@/components/ui/button';
import { ROUTES } from '@/constants';
import type { HomeContent } from '@/lib/content/pages';
import { cn } from '@/lib/utils';
import { Swirl } from './Decorations';
import { container, gradient, sectionHeading } from './homeStyles';

/**
 * "Our Assessment Journey": the photo slides in from the left with the brand
 * swirl drawing over it, the lilac card from the right, then its steps one by
 * one. Without a photo the panel shows the brand gradient.
 */
export function JourneySection({ content }: { content: HomeContent['journey'] }) {
  const { image } = content;

  return (
    <section aria-labelledby="journey-heading" className={cn(container, 'mt-16 grid gap-6 sm:mt-20 lg:grid-cols-[1.25fr_1fr] xl:u-mt-100 xl:grid-cols-[calc(var(--u)*932)_1fr] xl:u-gap-40')}>
      <Reveal from="left" className="relative isolate min-h-72 overflow-hidden rounded-[2rem] sm:min-h-96 xl:u-min-h-748 xl:u-rounded-40">
        {image?.src ? (
          <Image src={image.src} alt={image.alt} fill sizes="(min-width: 1280px) 49vw, (min-width: 1024px) 55vw, 100vw" className="-z-10 object-cover transition-transform duration-[1.2s] ease-out hover:scale-[1.03]" />
        ) : (
          <div aria-hidden="true" className={cn('absolute inset-0 -z-10 rotate-180', gradient)} />
        )}
        <Swirl delay={0.6} strokeWidth={22} opacity={image?.src ? 0.4 : 0.32} className="left-0 top-0 w-full" />
      </Reveal>

      <Reveal from="right" delay={0.1} className="flex flex-col rounded-[2rem] bg-brand-lilac px-7 py-10 text-brand-purple sm:px-12 sm:py-12 xl:u-rounded-45 xl:u-pl-57 xl:u-pr-52 xl:u-pt-56 xl:u-pb-52">
        <h2 id="journey-heading" className={sectionHeading}>
          <MultiLine text={content.title} />
        </h2>
        <Stagger as="ol" stagger={0.1} delay={0.25} className="mt-6 space-y-2 text-base font-medium leading-relaxed sm:text-lg xl:u-mt-52 xl:space-y-0 xl:u-text-25 xl:u-leading-45">
          {content.steps.map((step, i) => (
            <StaggerItem as="li" key={i} from="right" className="flex gap-3 xl:u-gap-12">
              <span aria-hidden="true" className="w-6 shrink-0 text-right font-bold tabular-nums xl:u-w-26">
                {i + 1}.
              </span>
              <span>
                {step}
              </span>
            </StaggerItem>
          ))}
        </Stagger>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 xl:mt-auto xl:u-pt-40">
          <ButtonLink href={ROUTES.book}>{content.cta}</ButtonLink>
          <Link
            href={ROUTES.assessmentJourney}
            className="group inline-flex items-center gap-4 rounded font-semibold transition-colors hover:text-brand-violet focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple xl:u-gap-18 xl:u-text-20"
          >
            {content.linkLabel}
            <LongArrow className="w-12 transition-transform duration-300 ease-out group-hover:translate-x-1.5 xl:u-w-54" />
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
