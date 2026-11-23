'use client';

import Image from 'next/image';
import { motion } from 'motion/react';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { MultiLine } from '@/components/common/MultiLine';
import { ButtonLink } from '@/components/ui/button';
import { ClosingCta } from '@/components/home/ClosingCta';
import { Swirl } from '@/components/home/Decorations';
import { container } from '@/components/home/homeStyles';
import { ROUTES } from '@/constants';
import type { ApproachContent } from '@/lib/content/pages';
import { cn } from '@/lib/utils';
import { pageHeading, pageText } from './aboutStyles';
import { PageLabel } from './PageLabel';
import { SwipeRow, swipeCardSize, swipeCardVariants } from './SwipeRow';

/** Step cards get deeper from lilac to violet, as in the design. */
const STEP_COLOURS = ['bg-[#dbb0f3]', 'bg-[#c889ee]', 'bg-[#b661e8]'];

/**
 * "Understanding first. Support always.": text on the left, the cut-out photo
 * on the right with a pale pink swirl behind it.
 */
function ApproachHero({ content }: { content: ApproachContent['hero'] }) {
  const { image } = content;
  return (
    <section aria-labelledby="approach-heading" className={cn(container, 'relative isolate mt-4 xl:u-mt-124 xl:u-pb-55')}>
      <Swirl delay={0.8} opacity={0.55} color="var(--color-brand-pink)" strokeWidth={30} className="-z-10 hidden -scale-x-100 lg:block lg:left-[40%] lg:top-[25%] lg:w-[45%] xl:u-left-540 xl:u-top-260 xl:u-w-720" />
      <PageLabel>{content.label}</PageLabel>

      <div className="lg:grid lg:grid-cols-[1fr_auto] xl:block">
        <Stagger onLoad delay={0.2} stagger={0.15} className="relative mt-10 xl:u-mt-77 xl:u-max-w-1000 xl:u-pl-100">
          <StaggerItem>
            <h1 id="approach-heading" className={cn(pageHeading, 'text-brand-violet')}>
              <MultiLine text={content.title} />
            </h1>
          </StaggerItem>
          <StaggerItem>
            <p className={cn(pageText, 'mt-5 whitespace-pre-line text-brand-purple xl:u-mt-20 xl:u-max-w-760')}>{content.body}</p>
          </StaggerItem>
          <StaggerItem from="pop" className="mt-8 xl:u-mt-53">
            <ButtonLink href={ROUTES.contact} variant="violet">
              {content.cta}
            </ButtonLink>
          </StaggerItem>
        </Stagger>

        {image?.src && (
          <Reveal onLoad from="up" delay={0.4} className="pointer-events-none relative mx-auto mt-10 h-96 w-fit sm:h-[30rem] lg:mt-0 lg:self-end xl:absolute xl:bottom-0 xl:-u-right-10 xl:mt-0 xl:u-h-987">
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width || 800}
              height={image.height || 900}
              priority
              sizes="(min-width: 1280px) 45vw, (min-width: 1024px) 40vw, 90vw"
              className="h-full w-auto object-contain object-bottom"
            />
          </Reveal>
        )}
      </div>
    </section>
  );
}

/** The three steps: label at the top, the title and text at the bottom of each card. */
function Steps({ steps }: { steps: ApproachContent['steps'] }) {
  return (
    <SwipeRow label="How we work" labels={steps.map((s) => s.label)} className="mt-12 sm:mt-16 xl:u-mt-102">
      {steps.map((step, i) => (
        <motion.article
          key={i}
          custom={i}
          variants={swipeCardVariants}
          className={cn(
            swipeCardSize,
            STEP_COLOURS[i % STEP_COLOURS.length],
            'flex min-h-[24rem] flex-col rounded-[1.75rem] p-7 text-white transition duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_18px_40px_rgba(164,58,226,0.3)] xl:u-h-580 xl:u-w-471 xl:u-rounded-30 xl:u-px-46 xl:u-pt-48 xl:u-pb-67'
          )}
        >
          <p className="text-3xl xl:u-text-50 xl:u-leading-56">{step.label}</p>
          <h2 className="mt-auto pt-10 text-4xl font-bold leading-[1.05] xl:pt-0 xl:u-text-60 xl:u-leading-65">
            <MultiLine text={step.title} always />
          </h2>
          <p className="mt-3 text-base leading-snug xl:u-mt-15 xl:u-text-25 xl:u-leading-35">
            <MultiLine text={step.body} />
          </p>
        </motion.article>
      ))}
    </SwipeRow>
  );
}

/** Our approach; `content` is edited in the dashboard (Website content → About › Our approach). */
export function ApproachSections({ content }: { content: ApproachContent }) {
  return (
    <div className="flex w-full flex-col overflow-x-clip">
      <ApproachHero content={content.hero} />
      <Steps steps={content.steps} />
      <div className="xl:u-h-73" aria-hidden="true" />
      <ClosingCta content={content.closing} variant="about" />
    </div>
  );
}
