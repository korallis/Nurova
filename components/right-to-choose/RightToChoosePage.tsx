'use client';

import { motion } from 'motion/react';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { MultiLine } from '@/components/common/MultiLine';
import { GradientHero } from '@/components/common/GradientHero';
import { SwipeRow, swipeCardSize, swipeCardVariants } from '@/components/about/SwipeRow';
import { pageText } from '@/components/about/aboutStyles';
import { Faqs, STROKE_COLOURS } from '@/components/assessments/AssessmentPage';
import { ButtonLink } from '@/components/ui/button';
import { ClosingCta } from '@/components/home/ClosingCta';
import { container, sectionHeading } from '@/components/home/homeStyles';
import { ROUTES } from '@/constants';
import type { RightToChooseContent } from '@/lib/content/right-to-choose';
import { cn } from '@/lib/utils';

/** The eligibility cards deepen from salmon to coral, as in the design. */
const CHECK_COLOURS = ['bg-[#fa9a9b]', 'bg-[#f97879]', 'bg-brand-coral'];

/** Body text on this page's cards: 25px with 45px lines. */
const cardText = 'text-base leading-relaxed sm:text-lg sm:leading-relaxed xl:u-text-25 xl:u-leading-45';

/** "Access the assessment you need, sooner.": the cut-out photo stands on the card's bottom edge on the right. */
function Hero({ label, hero }: { label: string; hero: RightToChooseContent['hero'] }) {
  return (
    <GradientHero
      id="rtc-heading"
      label={label}
      title={hero.title}
      body={hero.body}
      bodyWidth="xl:u-max-w-660"
      primary={{ label: hero.primaryCta, href: ROUTES.checkEligibility }}
      secondary={{ label: hero.secondaryCta, href: ROUTES.contact }}
      image={hero.image}
      imageClassName="mx-auto h-80 sm:h-[28rem] xl:bottom-0 xl:u-right-51 xl:u-h-683"
    />
  );
}

/** "What is Right to Choose?": centred heading, text and buttons. */
function Intro({ intro }: { intro: RightToChooseContent['intro'] }) {
  return (
    <section aria-labelledby="rtc-intro-heading" className={cn(container, 'mt-16 text-center text-brand-purple sm:mt-20 xl:u-mt-101')}>
      <Stagger stagger={0.14}>
        <StaggerItem>
          <h2 id="rtc-intro-heading" className={sectionHeading}>
            {intro.title}
          </h2>
        </StaggerItem>
        <StaggerItem>
          <p className={cn(pageText, 'mx-auto mt-5 max-w-3xl xl:u-mt-22 xl:max-w-none')}>
            <MultiLine text={intro.body} />
          </p>
        </StaggerItem>
        <StaggerItem className="mt-8 flex flex-wrap justify-center gap-3 xl:u-mt-57 xl:u-gap-24">
          <ButtonLink href={ROUTES.checkEligibility} variant="violet">
            {intro.primaryCta}
          </ButtonLink>
          <ButtonLink href={ROUTES.contact} variant="outlinePurple">
            {intro.secondaryCta}
          </ButtonLink>
        </StaggerItem>
      </Stagger>
    </section>
  );
}

/** The two cards side by side: who can use it (white, violet edge) and how the process works (violet). */
function WhoAndHow({ who, process }: { who: RightToChooseContent['who']; process: RightToChooseContent['process'] }) {
  const card = 'flex flex-1 flex-col items-center rounded-[2rem] px-6 py-10 text-center sm:px-10 sm:py-12 xl:u-h-560 xl:u-rounded-50';
  const title = 'text-[2rem] font-bold leading-[1.1] sm:text-5xl sm:leading-[1.1] xl:u-text-70 xl:u-leading-70';
  return (
    <Stagger stagger={0.15} className={cn(container, 'mt-12 grid gap-6 lg:grid-cols-2 xl:u-mt-100 xl:u-gap-34')}>
      <StaggerItem className="flex">
        <section
          aria-labelledby="rtc-who-heading"
          className={cn(card, 'border-[10px] border-brand-violet bg-white text-brand-purple xl:u-border-15 xl:u-px-60 xl:u-pt-55 xl:u-pb-47')}
        >
          <h2 id="rtc-who-heading" className={cn(title, 'text-brand-violet')}>
            <MultiLine text={who.title} />
          </h2>
          <p className={cn(cardText, 'mt-5 max-w-md xl:u-mt-23 xl:u-max-w-490')}>{who.body}</p>
          <ButtonLink href={ROUTES.contact} variant="violet" className="mt-8 xl:mt-auto">
            {who.cta}
          </ButtonLink>
        </section>
      </StaggerItem>

      <StaggerItem className="flex">
        <section aria-labelledby="rtc-how-heading" className={cn(card, 'bg-brand-violet text-white xl:u-px-40 xl:u-pt-70 xl:u-pb-62')}>
          <h2 id="rtc-how-heading" className={title}>
            {process.title}
          </h2>
          <ol className={cn(cardText, 'mt-5 list-decimal pl-6 text-left xl:u-mt-33 xl:list-inside xl:pl-0')}>
            {process.steps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
          <ButtonLink href={ROUTES.checkEligibility} variant="whitePurple" className="mt-8 xl:mt-auto">
            {process.cta}
          </ButtonLink>
        </section>
      </StaggerItem>
    </Stagger>
  );
}

/** "What happens when we check eligibility?": three coral cards, title and text at the bottom of each. */
function Checks({ checks }: { checks: RightToChooseContent['checks'] }) {
  return (
    <section aria-labelledby="rtc-checks-heading" className="mt-16 sm:mt-20 xl:u-mt-89">
      <Reveal from="up" className={container}>
        <h2 id="rtc-checks-heading" className={cn(sectionHeading, 'text-center text-brand-coral')}>
          {checks.title}
        </h2>
      </Reveal>
      <SwipeRow label="Eligibility checks" labels={checks.steps.map((s) => s.title.replace(/\s*\n\s*/g, ' '))} className="mt-6 xl:u-mt-50">
        {checks.steps.map((step, i) => (
          <motion.article
            key={i}
            custom={i}
            variants={swipeCardVariants}
            className={cn(
              swipeCardSize,
              CHECK_COLOURS[i % CHECK_COLOURS.length],
              'flex min-h-[24rem] flex-col justify-end rounded-[1.75rem] p-7 text-white transition duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_18px_40px_rgba(247,86,88,0.3)] xl:u-h-581 xl:u-w-472 xl:u-rounded-30 xl:u-px-46 xl:u-pb-48'
            )}
          >
            <h3 className="text-[clamp(1.75rem,9vw,2.25rem)] font-bold leading-[1.05] break-words xl:u-text-60 xl:u-leading-65">
              <MultiLine text={step.title} always />
            </h3>
            <p className="mt-3 text-base leading-snug xl:u-mt-12 xl:u-max-w-376 xl:u-text-25 xl:u-leading-35">{step.body}</p>
          </motion.article>
        ))}
      </SwipeRow>
    </section>
  );
}

/** The Right to Choose page; `content` is edited in the dashboard (Website content → Right to Choose). */
export function RightToChoosePage({ content }: { content: RightToChooseContent }) {
  const { closing } = content;
  return (
    <div className="flex w-full flex-col overflow-x-clip">
      <Hero label={content.label} hero={content.hero} />
      <Intro intro={content.intro} />
      <WhoAndHow who={content.who} process={content.process} />
      <Checks checks={content.checks} />
      <Faqs faq={content.faq} />
      <ClosingCta
        content={closing}
        variant="rightToChoose"
        colors={[STROKE_COLOURS[closing.strokeLeft], STROKE_COLOURS[closing.strokeRight]]}
        primaryHref={ROUTES.checkEligibility}
      />
    </div>
  );
}
