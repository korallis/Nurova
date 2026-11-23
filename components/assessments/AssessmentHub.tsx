'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { FrostedHero } from '@/components/common/FrostedHero';
import { LongArrow } from '@/components/common/LongArrow';
import { MultiLine } from '@/components/common/MultiLine';
import { Reveal } from '@/components/motion/Reveal';
import { SwipeRow, swipeCardSize, swipeCardVariants } from '@/components/about/SwipeRow';
import { ClosingCta } from '@/components/home/ClosingCta';
import { container } from '@/components/home/homeStyles';
import { ROUTES } from '@/constants';
import type { AssessmentHubContent } from '@/lib/content/assessments';
import { cn } from '@/lib/utils';

const CARD_TONES = {
  pink: { card: 'bg-brand-pink text-brand-purple hover:shadow-[0_18px_40px_rgba(254,188,224,0.6)]', tagline: 'text-brand-purple' },
  coral: { card: 'bg-brand-coral text-white hover:shadow-[0_18px_40px_rgba(247,86,88,0.35)]', tagline: 'text-brand-coral' },
} as const;

/** The adult and children assessment pages: frosted hero, three assessment cards, a summary line and the closing call to action. */
export function AssessmentHub({ content, headingId }: { content: AssessmentHubContent; headingId: string }) {
  const { hero, cards } = content;
  const tone = CARD_TONES[cards.tone];

  return (
    <div className="flex w-full flex-col overflow-x-clip">
      <FrostedHero
        id={headingId}
        label={content.label}
        title={hero.title}
        body={hero.body}
        image={hero.image}
        tone={hero.tone}
        primary={{ label: hero.primaryCta, href: ROUTES.book }}
        secondary={{ label: hero.secondaryCta, href: ROUTES.contact }}
      />

      <SwipeRow label="Assessments" labels={cards.items.map((c) => c.title.replace(/\s*\n\s*/g, ' '))} className="mt-12 sm:mt-16 xl:u-mt-98">
        {cards.items.map((card, i) => (
          <motion.article
            key={card.href + i}
            custom={i}
            variants={swipeCardVariants}
            className={cn(
              swipeCardSize,
              tone.card,
              'group relative flex min-h-[24rem] flex-col rounded-[1.75rem] p-7 transition duration-300 ease-out hover:-translate-y-1.5 xl:u-h-580 xl:u-w-471 xl:u-rounded-30 xl:u-px-46 xl:u-pt-50 xl:u-pb-46'
            )}
          >
            <h2 className="text-[1.85rem] font-bold leading-[1.05] xl:u-text-50 xl:u-leading-50">
              <MultiLine text={card.title} always />
            </h2>
            <p className="mt-4 text-base leading-relaxed xl:u-mt-26 xl:u-text-25 xl:u-leading-35">{card.body}</p>
            <Link
              href={card.href}
              className="mt-auto inline-flex items-center gap-4 self-end pt-8 text-sm font-semibold after:absolute after:inset-0 after:rounded-[inherit] focus-visible:outline-none focus-visible:after:ring-4 focus-visible:after:ring-brand-violet xl:u-gap-18 xl:u-pt-30 xl:u-text-20"
            >
              Learn More<span className="sr-only"> about {card.title.replace(/\s*\n\s*/g, ' ')}</span>
              <LongArrow className="w-12 transition-transform duration-300 ease-out group-hover:translate-x-1.5 xl:u-w-54" />
            </Link>
          </motion.article>
        ))}
      </SwipeRow>

      <Reveal from="up" className={cn(container, 'mt-8 text-center xl:u-mt-30')}>
        <p className={cn(tone.tagline, 'text-lg font-bold leading-snug sm:text-xl xl:u-text-28 xl:u-leading-35')}>{content.tagline}</p>
      </Reveal>

      <ClosingCta content={content.closing} variant="hub" />
    </div>
  );
}
