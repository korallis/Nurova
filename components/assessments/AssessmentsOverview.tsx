'use client';

import { motion } from 'motion/react';
import { AboutHero } from '@/components/about/AboutHero';
import { SwipeRow, swipeCardSize, swipeCardVariants } from '@/components/about/SwipeRow';
import { MultiLine } from '@/components/common/MultiLine';
import { Stagger, StaggerItem } from '@/components/motion/Reveal';
import { ButtonLink } from '@/components/ui/button';
import { AssessmentCarousel } from '@/components/home/AssessmentCarousel';
import { Spiral, Squiggle } from '@/components/home/Decorations';
import { bodyText, container, sectionHeading } from '@/components/home/homeStyles';
import { ROUTES } from '@/constants';
import type { AssessmentsOverviewContent } from '@/lib/content/assessments';
import { cn } from '@/lib/utils';

/** "What happens during an assessment?" cards deepen from salmon to coral, as in the design. */
const DURING_COLOURS = ['bg-[#fa9a9b]', 'bg-[#f97879]', 'bg-brand-coral'];

/** Centred heading, text and buttons. */
function Centred({ id, title, body, children, className }: { id: string; title: string; body: string; children: React.ReactNode; className?: string }) {
  return (
    <Stagger stagger={0.14} className={cn('text-center text-brand-purple', className)}>
      <StaggerItem>
        <h2 id={id} className={sectionHeading}>
          {title}
        </h2>
      </StaggerItem>
      <StaggerItem>
        <p className={cn(bodyText, 'mx-auto mt-4 max-w-3xl xl:u-mt-18 xl:u-max-w-1300')}>
          <MultiLine text={body} />
        </p>
      </StaggerItem>
      <StaggerItem className="mt-7 flex flex-wrap justify-center gap-3 xl:u-mt-29 xl:u-gap-24">{children}</StaggerItem>
    </Stagger>
  );
}

/** The assessments overview (/assessments); `content` is edited in the dashboard (Website content → Assessments overview). */
export function AssessmentsOverview({ content }: { content: AssessmentsOverviewContent }) {
  const { hero, finder, during, unsure, professionals } = content;

  return (
    <div className="flex w-full flex-col overflow-x-clip">
      <AboutHero content={{ label: content.label, ...hero }} primaryHref="#find-assessment" secondaryHref={ROUTES.contact} headingId="assessments-heading" />

      {/* Find the right assessment */}
      <section id="find-assessment" aria-labelledby="finder-heading" className="mt-16 scroll-mt-28 sm:mt-20 xl:u-mt-100">
        <Centred id="finder-heading" title={finder.title} body={finder.body} className={container}>
          <ButtonLink href={ROUTES.adultAssessments} variant="violet">
            {finder.adultCta}
          </ButtonLink>
          <ButtonLink href={ROUTES.childAssessments} variant="outlinePurple">
            {finder.childCta}
          </ButtonLink>
        </Centred>
        <AssessmentCarousel cards={content.cards} tone="violet" label="All assessments" className="mt-10 sm:mt-14 xl:u-mt-70" />
      </section>

      {/* What happens during an assessment? */}
      <section aria-labelledby="during-heading" className="mt-16 sm:mt-20 xl:u-mt-90">
        <h2 id="during-heading" className={cn(container, sectionHeading, 'text-center text-brand-coral')}>
          {during.title}
        </h2>
        <SwipeRow label={during.title} labels={during.steps.map((s) => s.title.replace(/\s*\n\s*/g, ' '))} className="mt-8 xl:u-mt-55">
          {during.steps.map((step, i) => (
            <motion.article
              key={i}
              custom={i}
              variants={swipeCardVariants}
              className={cn(
                swipeCardSize,
                DURING_COLOURS[i % DURING_COLOURS.length],
                'flex min-h-[22rem] flex-col justify-end rounded-[1.75rem] p-7 text-white transition duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_18px_40px_rgba(247,86,88,0.3)] xl:u-h-580 xl:u-w-471 xl:u-rounded-30 xl:u-px-46 xl:u-pb-56'
              )}
            >
              <h3 className="text-4xl font-bold leading-[1.05] xl:u-text-60 xl:u-leading-65">
                <MultiLine text={step.title} always />
              </h3>
              <p className="mt-3 text-base leading-snug xl:u-mt-15 xl:u-text-25 xl:u-leading-35">{step.body}</p>
            </motion.article>
          ))}
        </SwipeRow>
      </section>

      {/* Unsure which assessment to choose? + For schools, NHS teams and commissioners */}
      <section aria-labelledby="unsure-heading" className="relative mt-16 px-5 pb-6 sm:mt-20 sm:px-8 xl:u-mt-60 xl:u-pb-100">
        <Spiral color="var(--color-brand-pink)" className="-left-10 top-0 w-36 sm:w-48 xl:-u-left-10 xl:u-top-20 xl:u-w-360" />
        <Squiggle color="var(--color-brand-pink)" className="hidden -scale-x-100 rotate-[200deg] md:block md:right-0 md:top-1/3 md:w-52 xl:u-left-1440 xl:u-top-160 xl:u-w-420" />

        <Centred id="unsure-heading" title={unsure.title} body={unsure.body} className="relative mx-auto xl:u-max-w-1300">
          <ButtonLink href={ROUTES.contact} variant="violet">
            {unsure.primaryCta}
          </ButtonLink>
          <ButtonLink href={ROUTES.contact} variant="outlinePurple" className="xl:u-min-w-228">
            {unsure.secondaryCta}
          </ButtonLink>
        </Centred>

        <Stagger stagger={0.14} className="relative mx-auto mt-14 text-center text-brand-purple xl:u-mt-75 xl:u-max-w-1100">
          <StaggerItem>
            <h2 className="text-2xl font-bold leading-tight sm:text-4xl xl:u-text-50 xl:u-leading-60">{professionals.title}</h2>
          </StaggerItem>
          <StaggerItem>
            <p className={cn(bodyText, 'mx-auto mt-4 xl:u-mt-22')}>{professionals.body}</p>
          </StaggerItem>
          <StaggerItem from="pop" className="mt-7 xl:u-mt-25">
            <ButtonLink href={ROUTES.professionals}>{professionals.cta}</ButtonLink>
          </StaggerItem>
        </Stagger>
      </section>
    </div>
  );
}
