'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'motion/react';
import { Minus, Plus } from 'lucide-react';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { MultiLine } from '@/components/common/MultiLine';
import { SplitFeature } from '@/components/common/SplitFeature';
import { PageLabel } from '@/components/about/PageLabel';
import { pageHeading, pageText } from '@/components/about/aboutStyles';
import { ButtonLink } from '@/components/ui/button';
import { ClosingCta } from '@/components/home/ClosingCta';
import { Swirl } from '@/components/home/Decorations';
import { bodyText, container, sectionHeading } from '@/components/home/homeStyles';
import { ROUTES } from '@/constants';
import type { AssessmentPageContent, CalloutTone, FaqTone, StepTone, StrokeTone } from '@/lib/content/assessments';
import { cn } from '@/lib/utils';

// ── Colours, sampled from the designs ──────────────────────────────────────

const STEP_COLOURS: Record<StepTone, string> = {
  purple: 'bg-brand-purple text-white',
  violet: 'bg-brand-violet text-white',
  lavender: 'bg-[#c16ef3] text-white',
  coral: 'bg-brand-coral text-white',
  salmon: 'bg-[#fc8e8f] text-white',
  pink: 'bg-brand-pink text-brand-purple',
};

const CALLOUT_COLOURS: Record<CalloutTone, { card: string; primary: 'white' | 'whitePurple' }> = {
  coral: { card: 'bg-brand-coral', primary: 'white' },
  purple: { card: 'bg-brand-purple', primary: 'whitePurple' },
  violet: { card: 'bg-brand-violet', primary: 'whitePurple' },
};

const FAQ_COLOURS: Record<FaqTone, { card: string; bar: string; answer: string; cta: 'purple' | 'coral' }> = {
  coral: { card: 'bg-brand-coral text-white', bar: 'bg-brand-violet text-white', answer: 'bg-[#deb0fa] text-brand-purple', cta: 'purple' },
  purple: { card: 'bg-brand-purple text-white', bar: 'bg-brand-violet text-white', answer: 'bg-[#deb0fa] text-brand-purple', cta: 'coral' },
  lavender: { card: 'bg-[#c16ef3] text-white', bar: 'bg-brand-violet text-white', answer: 'bg-[#deb0fa] text-brand-purple', cta: 'purple' },
  pink: { card: 'bg-brand-pink text-brand-purple', bar: 'bg-[#ffe8f4] text-brand-purple', answer: 'bg-[#ffd4eb] text-brand-purple', cta: 'purple' },
  coralSoft: { card: 'bg-brand-coral text-white', bar: 'bg-[#ffa9aa] text-brand-purple', answer: 'bg-[#fc8e8f] text-brand-purple', cta: 'purple' },
};

export const STROKE_COLOURS: Record<StrokeTone, string> = {
  pink: 'var(--color-brand-pink)',
  lavender: '#c16ef3',
  violet: 'var(--color-brand-violet)',
  coral: 'var(--color-brand-coral)',
  salmon: '#fc8e8f',
};

// ── Hero ───────────────────────────────────────────────────────────────────

/**
 * Two styles, as in the designs. `photo`: the photo fills a coral-tinted card
 * with white text (Combined). `cutout`: purple text on white with a cut-out
 * photo standing on the right, its lower part hidden behind the card that
 * follows (Adult and Child pages).
 */
/**
 * Where the cut-out photo sits, in design pixels: its box size (the size it was
 * exported at), how far the box's right edge is from the page edge (negative
 * runs past it) and its top relative to the label. Measured from each design.
 */
export interface PhotoBox {
  width: number;
  height: number;
  right: number;
  top: number;
}

const DEFAULT_PHOTO_BOX: PhotoBox = { width: 900, height: 1000, right: 0, top: 0 };

function Hero({ label, hero, photoBox = DEFAULT_PHOTO_BOX }: { label: string; hero: AssessmentPageContent['hero']; photoBox?: PhotoBox }) {
  const { image } = hero;
  const text = (
    <>
      <StaggerItem>
        <h1 id="assessment-heading" className={pageHeading}>
          <MultiLine text={hero.title} />
        </h1>
      </StaggerItem>
      <StaggerItem>
        <p className={cn(pageText, 'mt-5 whitespace-pre-line xl:u-mt-20 xl:u-max-w-900')}>{hero.body}</p>
      </StaggerItem>
    </>
  );

  if (hero.style === 'photo') {
    return (
      <section aria-labelledby="assessment-heading" className={cn(container, 'mt-4 xl:u-mt-124')}>
        <PageLabel>{label}</PageLabel>
        <Reveal onLoad from="zoom" delay={0.1} className="mt-5 xl:u-mt-37">
          <div className="relative isolate overflow-hidden rounded-[2rem] text-white xl:u-h-662 xl:u-rounded-50">
            <div aria-hidden="true" className="absolute inset-0 -z-30 bg-brand-coral" />
            {image?.src && <Image src={image.src} alt={image.alt} fill priority sizes="(min-width: 1280px) 90vw, 100vw" className="-z-20 object-cover opacity-55" />}
            <Swirl delay={0.9} opacity={0.4} className="-z-10 left-[-12%] top-[-40%] w-[70%] -scale-x-100 xl:-u-left-200 xl:-u-top-260 xl:u-w-900" />
            <Stagger onLoad delay={0.4} stagger={0.15} className="relative px-7 pb-12 pt-12 sm:px-12 sm:pb-16 sm:pt-16 xl:u-max-w-1200 xl:u-pl-100 xl:u-pr-0 xl:u-pt-58 xl:u-pb-0">
              {text}
              <StaggerItem className="mt-8 flex flex-wrap gap-3 xl:u-mt-53 xl:u-gap-24">
                <ButtonLink href={ROUTES.book}>{hero.primaryCta}</ButtonLink>
                <ButtonLink href={ROUTES.contact} variant="outlineWhite">
                  {hero.secondaryCta}
                </ButtonLink>
              </StaggerItem>
            </Stagger>
          </div>
        </Reveal>
      </section>
    );
  }

  return (
    // Clipped at the bottom only, so the photo stops where the next card begins (as in the designs).
    <section aria-labelledby="assessment-heading" className={cn(container, 'relative isolate mt-4 xl:u-mt-124 xl:u-min-h-910 xl:[clip-path:inset(-200%_-200%_0_-200%)]')}>
      <Swirl delay={0.8} opacity={1} color="#f3e6fb" strokeWidth={30} className="-z-10 hidden -scale-x-100 lg:block lg:left-[30%] lg:top-[5%] lg:w-[45%] xl:u-left-480 xl:u-top-60 xl:u-w-760" />
      <PageLabel>{label}</PageLabel>

      <div className="lg:grid lg:grid-cols-[1fr_minmax(0,40%)] lg:items-end xl:block">
        <Stagger onLoad delay={0.2} stagger={0.15} className="relative z-10 mt-10 text-brand-purple xl:u-mt-77 xl:u-max-w-1160 xl:u-pl-100 xl:u-pb-70">
          {text}
          <StaggerItem className="mt-8 flex flex-wrap gap-3 xl:u-mt-53 xl:u-gap-24">
            <ButtonLink href={ROUTES.book}>{hero.primaryCta}</ButtonLink>
            <ButtonLink href={ROUTES.contact} variant="outlinePurple">
              {hero.secondaryCta}
            </ButtonLink>
          </StaggerItem>
        </Stagger>

        {image?.src && (
          <Reveal
            onLoad
            from="up"
            delay={0.4}
            className="pointer-events-none relative mx-auto mt-8 h-80 w-full max-w-md sm:h-[26rem] lg:mt-0 xl:absolute xl:mx-0 xl:mt-0 xl:h-[var(--box-h)] xl:w-[var(--box-w)] xl:max-w-none xl:right-[var(--box-r)] xl:top-[var(--box-t)]"
            style={{ '--box-w': `calc(var(--u) * ${photoBox.width})`, '--box-h': `calc(var(--u) * ${photoBox.height})`, '--box-r': `calc(var(--u) * ${photoBox.right})`, '--box-t': `calc(var(--u) * ${photoBox.top})` } as React.CSSProperties}
          >
            {/* The section clips the box at the bottom, where the next card begins. */}
            <Image src={image.src} alt={image.alt} fill priority sizes="(min-width: 1280px) 52vw, 90vw" className="object-contain object-bottom xl:object-top" />
          </Reveal>
        )}
      </div>
    </section>
  );
}

// ── Card under the hero ────────────────────────────────────────────────────

function Callout({ callout, afterPhoto }: { callout: AssessmentPageContent['callout']; afterPhoto: boolean }) {
  const c = CALLOUT_COLOURS[callout.tone];
  return (
    <section aria-labelledby="callout-heading" className={cn(container, 'relative z-10', afterPhoto ? 'mt-12 xl:u-mt-100' : 'mt-0')}>
      <Reveal from="up" className={cn(c.card, 'rounded-[2rem] px-7 py-10 text-white sm:px-12 sm:py-12 xl:u-rounded-50 xl:u-pl-100 xl:u-pr-100 xl:u-pt-72 xl:u-pb-72')}>
        <h2 id="callout-heading" className="text-[2rem] font-bold leading-[1.15] sm:text-5xl xl:u-text-70 xl:u-leading-95">
          <MultiLine text={callout.title} />
        </h2>
        <p className={cn(bodyText, 'mt-4 xl:u-mt-10 xl:u-max-w-1500')}>{callout.body}</p>
        <div className="mt-7 flex flex-wrap gap-3 xl:u-mt-40 xl:u-gap-24">
          <ButtonLink href={ROUTES.book} variant={c.primary}>
            {callout.primaryCta}
          </ButtonLink>
          <ButtonLink href={ROUTES.professionals} variant="outlineWhite">
            {callout.secondaryCta}
          </ButtonLink>
        </div>
      </Reveal>
    </section>
  );
}

// ── Our assessment process ─────────────────────────────────────────────────

/**
 * Steps three to a row, as in the designs: every pill is the same width
 * (565 design px) and overlaps the next by 87. On the first row each pill
 * lies over the one after it; on the second row each lies over the one
 * before it. A two-step last row splits 624/983. On phones the steps stack.
 */
function Process({ process }: { process: AssessmentPageContent['process'] }) {
  const rows: AssessmentPageContent['process']['steps'][] = [];
  for (let i = 0; i < process.steps.length; i += 3) rows.push(process.steps.slice(i, i + 3));

  return (
    <section aria-labelledby="process-heading" className={cn(container, 'mt-16 sm:mt-20 xl:u-mt-100')}>
      <Reveal from="up">
        <h2 id="process-heading" className={cn(sectionHeading, 'text-center text-brand-purple')}>
          {process.title}
        </h2>
      </Reveal>
      <Stagger stagger={0.08} className="mx-auto mt-8 flex flex-col gap-2 md:gap-0 xl:u-mt-45 xl:u-w-1520">
        {rows.map((row, r) => {
          // Even rows: earlier pills on top. Odd rows: later pills on top.
          const leftOnTop = r % 2 === 0;
          return (
            <ol key={r} start={r * 3 + 1} className="flex flex-col gap-2 md:flex-row md:gap-0">
              {row.map((step, i) => {
            const n = r * 3 + i + 1;
            const first = i === 0;
            const last = i === row.length - 1;
            // The part of this pill hidden under a neighbour gets no text.
            const hiddenLeft = !first && leftOnTop;
            const hiddenRight = !last && !leftOnTop;
            return (
              <StaggerItem
                as="li"
                key={n}
                from="left"
                style={{ zIndex: leftOnTop ? 10 - i : i + 1 }}
                className={cn(
                  STEP_COLOURS[step.tone],
                  'relative flex min-h-20 items-center gap-4 rounded-[1.5rem] px-6 py-3',
                  'md:min-h-24 md:rounded-[2rem] xl:u-min-h-147 xl:u-gap-25 xl:u-rounded-45 xl:py-0',
                  // Widths and overlap.
                  row.length === 2
                    ? first
                      ? 'md:w-[41%] md:shrink-0 xl:w-[calc(var(--u)*624)]'
                      : 'md:min-w-0 md:flex-1'
                    : 'md:w-[calc((100%+6rem)/3)] md:shrink-0 xl:w-[calc(var(--u)*565)]',
                  !first && 'md:-ml-12 xl:-u-ml-87',
                  // Padding from the visible edge.
                  hiddenLeft ? 'md:pl-[4.5rem] xl:u-pl-117' : 'md:pl-6 xl:u-pl-40',
                  hiddenRight ? 'md:pr-16 xl:u-pr-117' : 'md:pr-6 xl:u-pr-30'
                )}
              >
                <span aria-hidden="true" className="shrink-0 text-5xl font-bold leading-none xl:u-text-100">
                  {n}
                </span>
                <span className="text-base font-bold leading-tight sm:text-lg xl:u-text-30 xl:u-leading-35">
                  <span className="sr-only">Step {n}: </span>
                  {step.title}
                </span>
              </StaggerItem>
            );
              })}
            </ol>
          );
        })}
      </Stagger>
    </section>
  );
}


// ── What's included ────────────────────────────────────────────────────────

function Included({ included }: { included: AssessmentPageContent['included'] }) {
  return (
    <section aria-labelledby="included-heading" className={cn(container, 'mt-16 text-center text-brand-purple sm:mt-20 xl:u-mt-100')}>
      <Stagger stagger={0.14}>
        <StaggerItem>
          <h2 id="included-heading" className={sectionHeading}>
            {included.title}
          </h2>
        </StaggerItem>
        <StaggerItem>
          <p className={cn(bodyText, 'mx-auto mt-5 max-w-3xl xl:u-mt-22 xl:u-max-w-1100')}>{included.body}</p>
        </StaggerItem>
        <StaggerItem className="mt-7 flex flex-wrap justify-center gap-3 xl:u-mt-29 xl:u-gap-24">
          <ButtonLink href={ROUTES.contact} variant="violet">
            {included.primaryCta}
          </ButtonLink>
          <ButtonLink href={ROUTES.contact} variant="outlinePurple" className="xl:u-min-w-228">
            {included.secondaryCta}
          </ButtonLink>
        </StaggerItem>
      </Stagger>
    </section>
  );
}

// ── FAQs ───────────────────────────────────────────────────────────────────

/** The FAQ card: an accordion, the first question open. */
function Faqs({ faq }: { faq: AssessmentPageContent['faq'] }) {
  const c = FAQ_COLOURS[faq.tone];
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section aria-labelledby="faq-heading" className={cn(container, 'mt-16 sm:mt-20 xl:u-mt-100')}>
      <Reveal from="up" className={cn(c.card, 'rounded-[2rem] px-6 py-10 sm:px-12 sm:py-12 xl:u-rounded-50 xl:u-px-100 xl:u-pt-62 xl:u-pb-58')}>
        <h2 id="faq-heading" className="text-[2.2rem] font-bold leading-tight sm:text-6xl xl:u-text-90 xl:u-leading-100">
          {faq.title}
        </h2>
        <div className="mt-6 space-y-3 xl:u-mt-50 xl:space-y-0 xl:[&>*+*]:u-mt-13">
          {faq.items.map((item, i) => {
            const isOpen = open === i;
            const panelId = `faq-answer-${i}`;
            return (
              <div key={i}>
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className={cn(
                      c.bar,
                      'relative z-10 flex min-h-14 w-full cursor-pointer items-center justify-between gap-4 rounded-full px-5 py-3 text-left text-base font-semibold transition hover:brightness-105',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
                      'sm:text-lg xl:u-min-h-73 xl:u-px-35 xl:u-text-30 xl:u-leading-36'
                    )}
                  >
                    {item.question}
                    {isOpen ? <Minus className="h-4 w-4 shrink-0" strokeWidth={3.5} aria-hidden="true" /> : <Plus className="h-4 w-4 shrink-0" strokeWidth={3.5} aria-hidden="true" />}
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="-mt-14 overflow-hidden xl:-u-mt-73"
                    >
                      {/* Starts behind the question bar, so the bar's rounded ends sit on it, as in the designs. */}
                      <p className={cn(c.answer, 'rounded-[1.75rem] px-5 pb-5 pt-[4.5rem] text-sm leading-relaxed sm:text-base xl:u-rounded-36 xl:u-px-35 xl:u-pb-36 xl:u-pt-94 xl:u-text-24 xl:u-leading-35')}>
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
        <ButtonLink href={ROUTES.faqs} variant={c.cta} className="mt-7 xl:u-mt-44">
          {faq.cta}
        </ButtonLink>
      </Reveal>
    </section>
  );
}

/** The assessment page template; `content` is edited in the dashboard (Website content → Assessments › …). */
export function AssessmentPage({ content, photoBox }: { content: AssessmentPageContent; photoBox?: PhotoBox }) {
  const { closing } = content;
  return (
    <div className="flex w-full flex-col overflow-x-clip">
      <Hero label={content.label} hero={content.hero} photoBox={photoBox} />
      <Callout callout={content.callout} afterPhoto={content.hero.style === 'photo'} />
      <Process process={content.process} />
      <SplitFeature
        id="why-heading"
        title={content.why.title}
        body={content.why.body}
        image={content.why.image}
        cta={{ label: content.why.cta, href: ROUTES.contact }}
        className="mt-16 sm:mt-20 xl:u-mt-60"
      />
      <Included included={content.included} />
      <Faqs faq={content.faq} />
      <ClosingCta content={closing} variant="assessment" colors={[STROKE_COLOURS[closing.strokeLeft], STROKE_COLOURS[closing.strokeRight]]} />
    </div>
  );
}
