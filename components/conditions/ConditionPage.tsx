'use client';

import Image from 'next/image';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { MultiLine } from '@/components/common/MultiLine';
import { PageLabel } from '@/components/about/PageLabel';
import { pageHeading, pageText } from '@/components/about/aboutStyles';
import { ButtonLink } from '@/components/ui/button';
import { ClosingCta } from '@/components/home/ClosingCta';
import { container, sectionHeading } from '@/components/home/homeStyles';
import { STROKE_COLOURS } from '@/components/assessments/AssessmentPage';
import { ROUTES } from '@/constants';
import type { ConditionCardTone, ConditionHeroTone, ConditionPageContent } from '@/lib/content/conditions';
import { cn } from '@/lib/utils';

// ── Colours, sampled from the designs ──────────────────────────────────────

const HERO_TONES: Record<ConditionHeroTone, { card: string; primary: 'purple' | 'whitePurple'; secondary: 'outlinePurple' | 'outlineWhite' }> = {
  lilac: { card: 'bg-[#deb0fa] text-brand-purple', primary: 'purple', secondary: 'outlinePurple' },
  salmon: { card: 'bg-[#fc8e8f] text-brand-purple', primary: 'purple', secondary: 'outlinePurple' },
  violet: { card: 'bg-brand-violet text-white', primary: 'whitePurple', secondary: 'outlineWhite' },
  purple: { card: 'bg-brand-purple text-white', primary: 'whitePurple', secondary: 'outlineWhite' },
  coral: { card: 'bg-brand-coral text-white', primary: 'whitePurple', secondary: 'outlineWhite' },
};

const CARD_TONES: Record<ConditionCardTone, string> = {
  violet: 'bg-brand-violet',
  purple: 'bg-brand-purple',
  coral: 'bg-brand-coral',
};

/** The design's card height, in design px; the photo fills it at its own shape. */
const HERO_HEIGHT = 762;

/**
 * The coloured card with the heading, text and buttons on the left and the
 * photo on the right. On smaller screens the photo sits under the text.
 */
function Hero({ label, hero }: { label: string; hero: ConditionPageContent['hero'] }) {
  const t = HERO_TONES[hero.tone];
  const { image } = hero;
  // Width of the photo at the card's height, in design px.
  const photoWidth = image?.src ? Math.round((HERO_HEIGHT * (image.width || 1)) / (image.height || 1)) : 0;

  return (
    <section aria-labelledby="condition-heading" className={cn(container, 'mt-4 xl:u-mt-124')}>
      <PageLabel>{label}</PageLabel>
      <Reveal onLoad from="zoom" delay={0.1} className="mt-5 xl:u-mt-37">
        <div className={cn(t.card, 'relative flex flex-col overflow-hidden rounded-[2rem] xl:u-h-762 xl:flex-row xl:items-center xl:u-rounded-50')}>
          <Stagger
            onLoad
            delay={0.4}
            stagger={0.15}
            className="relative px-7 pb-10 pt-12 sm:px-12 sm:pb-14 sm:pt-16 xl:w-[var(--text-w)] xl:u-pl-100 xl:u-pr-40 xl:py-0"
            style={{ '--text-w': `calc(var(--u) * ${1720 - photoWidth})` } as React.CSSProperties}
          >
            <StaggerItem>
              <h1 id="condition-heading" className={pageHeading}>
                <MultiLine text={hero.title} />
              </h1>
            </StaggerItem>
            <StaggerItem>
              <p className={cn(pageText, 'mt-5 xl:u-mt-26 xl:u-max-w-820')}>{hero.body}</p>
            </StaggerItem>
            <StaggerItem className="mt-8 flex flex-wrap gap-3 xl:u-mt-55 xl:u-gap-24">
              <ButtonLink href={ROUTES.book} variant={t.primary}>
                {hero.primaryCta}
              </ButtonLink>
              <ButtonLink href={ROUTES.contact} variant={t.secondary}>
                {hero.secondaryCta}
              </ButtonLink>
            </StaggerItem>
          </Stagger>

          {image?.src && (
            <Reveal
              onLoad
              from="right"
              delay={0.3}
              className="relative h-80 w-full shrink-0 overflow-hidden rounded-[2rem] sm:h-[28rem] xl:ml-auto xl:h-full xl:w-[var(--photo-w)] xl:u-rounded-50"
              style={{ '--photo-w': `calc(var(--u) * ${photoWidth})` } as React.CSSProperties}
            >
              <Image src={image.src} alt={image.alt} fill priority sizes="(min-width: 1280px) 40vw, 100vw" className="object-cover" />
            </Reveal>
          )}
        </div>
      </Reveal>
    </section>
  );
}

/** A column of points; a line break in a point wraps it where the design does. */
function Points({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1 xl:space-y-0">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 xl:u-gap-12">
          <span aria-hidden="true">•</span>
          <span className="whitespace-pre-line">{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** "Common characteristics": heading, paragraph and two columns of points, centred in a coloured card. */
function Details({ details }: { details: ConditionPageContent['details'] }) {
  return (
    <section aria-labelledby="details-heading" className={cn(container, 'mt-12 sm:mt-16 xl:u-mt-101')}>
      <Reveal from="up" className={cn(CARD_TONES[details.tone], 'rounded-[2rem] px-6 py-10 text-center text-white sm:px-12 sm:py-12 xl:u-min-h-646 xl:u-rounded-50 xl:u-px-70 xl:u-pt-42 xl:u-pb-50')}>
        <h2 id="details-heading" className={sectionHeading}>
          {details.title}
        </h2>
        <p className="mx-auto mt-5 text-base leading-relaxed sm:text-lg xl:u-mt-22 xl:u-max-w-1580 xl:u-text-28 xl:u-leading-45">{details.body}</p>
        <Stagger
          stagger={0.1}
          className="mx-auto mt-8 grid w-fit grid-cols-1 gap-x-16 gap-y-1 text-left text-lg font-bold leading-snug sm:grid-cols-2 xl:u-mt-38 xl:u-gap-x-90 xl:gap-y-0 xl:u-text-28 xl:u-leading-45"
        >
          <StaggerItem>
            <Points items={details.left} />
          </StaggerItem>
          <StaggerItem>
            <Points items={details.right} />
          </StaggerItem>
        </Stagger>
      </Reveal>
    </section>
  );
}

/** The condition page template; `content` is edited in the dashboard (Website content → Conditions › …). */
export function ConditionPage({ content }: { content: ConditionPageContent }) {
  const { closing } = content;
  return (
    <div className="flex w-full flex-col overflow-x-clip">
      <Hero label={content.label} hero={content.hero} />
      <Details details={content.details} />
      <ClosingCta content={closing} variant={closing.squiggle === 'upright' ? 'hub' : 'condition'} colors={[STROKE_COLOURS[closing.strokeLeft], STROKE_COLOURS[closing.strokeRight]]} />
    </div>
  );
}
