'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, type Variants } from 'motion/react';
import { LongArrow } from '@/components/common/LongArrow';
import { MultiLine } from '@/components/common/MultiLine';
import { Reveal } from '@/components/motion/Reveal';
import type { AssessmentCard } from '@/lib/content/pages';
import { cn } from '@/lib/utils';

/*
 * The assessment cards, as an endless, swipeable row: the cards are rendered
 * three times and the row quietly jumps back to the middle copy whenever it
 * comes to rest, so there's always a card peeking in at each edge, as in the
 * design. Only the middle copy is read out or reached with Tab. Dots show
 * which cards are on screen (purple) and scroll to a card when pressed.
 */

const COPIES = 3;

/** Slides in the middle copy rise in one after another the first time the row scrolls into view. */
const slideVariants: Variants = {
  hidden: { opacity: 0, y: 48 },
  shown: (delay: number) => ({ opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay } }),
};

function Card({ card, isClone }: { card: AssessmentCard; isClone: boolean }) {
  const title = card.title.replace(/\s*\n\s*/g, ' ');
  return (
    <article className="group relative flex h-full min-h-[22rem] w-full flex-col rounded-[1.75rem] bg-brand-coral p-7 text-white transition duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_18px_40px_rgba(247,86,88,0.35)] sm:min-h-[25rem] xl:u-min-h-580 xl:u-rounded-30 xl:u-p-46 xl:u-pt-50">
      <h3 className="text-[1.85rem] font-bold leading-[1.05] xl:u-text-50 xl:u-leading-50">
        <MultiLine text={card.title} always />
      </h3>
      <p className="mt-4 text-base leading-relaxed xl:u-mt-26 xl:u-max-w-375 xl:u-text-25 xl:u-leading-35">{card.body}</p>
      <Link
        href={card.href}
        tabIndex={isClone ? -1 : undefined}
        className={cn(
          'mt-auto inline-flex items-center gap-4 self-end pt-8 text-sm font-semibold xl:u-gap-18 xl:u-pt-30 xl:u-text-20',
          // The whole card is the link's target; the focus ring goes round the card.
          'after:absolute after:inset-0 after:rounded-[inherit] focus-visible:outline-none focus-visible:after:ring-4 focus-visible:after:ring-brand-violet'
        )}
      >
        Learn More<span className="sr-only"> about {title}</span>
        <LongArrow className="w-12 transition-transform duration-300 ease-out group-hover:translate-x-1.5 xl:u-w-54" />
      </Link>
    </article>
  );
}

export function AssessmentCarousel({ cards }: { cards: AssessmentCard[] }) {
  const n = cards.length;
  const loop = n > 1;
  const slides = loop ? Array.from({ length: COPIES }, () => cards).flat() : cards;
  const offset = loop ? n : 0;

  const trackRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<Array<HTMLDivElement | null>>([]);
  // The first card on screen (0…n-1), and how many fit. The ref keeps it for the resize handler.
  const [first, setFirst] = useState(0);
  const firstRef = useRef(0);
  const [visible, setVisible] = useState(1);

  /** Distance between neighbouring cards. */
  const step = useCallback(() => {
    const [a, b] = slideRefs.current;
    return a && b ? b.offsetLeft - a.offsetLeft : 0;
  }, []);

  const measure = useCallback(() => {
    const track = trackRef.current;
    const width = step();
    if (!track || !width) return;
    const index = Math.round(track.scrollLeft / width);
    const padding = parseFloat(getComputedStyle(track).paddingLeft) || 0;
    const gap = width - (slideRefs.current[0]?.offsetWidth ?? width);
    firstRef.current = ((index % n) + n) % n;
    setFirst(firstRef.current);
    setVisible(Math.max(1, Math.floor((track.clientWidth - 2 * padding + gap) / width + 0.05)));
  }, [n, step]);

  /** When the row comes to rest in an outer copy, jump to the same card in the middle one (identical, so invisible). */
  const recentre = useCallback(() => {
    const track = trackRef.current;
    const width = step();
    if (!track || !width || !loop) return;
    const index = Math.round(track.scrollLeft / width);
    if (index < n) track.scrollTo({ left: track.scrollLeft + n * width, behavior: 'instant' });
    else if (index >= 2 * n) track.scrollTo({ left: track.scrollLeft - n * width, behavior: 'instant' });
  }, [loop, n, step]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    // Start on the middle copy, so there are cards either side.
    track.scrollTo({ left: offset * step(), behavior: 'instant' });
    measure();

    let frame = 0;
    let settle: ReturnType<typeof setTimeout> | undefined;
    const supportsScrollEnd = 'onscrollend' in window;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
      if (!supportsScrollEnd) {
        clearTimeout(settle);
        settle = setTimeout(recentre, 140);
      }
    };
    const onResize = () => {
      // Keep the same card first after the cards change size.
      track.scrollTo({ left: (offset + firstRef.current) * step(), behavior: 'instant' });
      measure();
    };
    track.addEventListener('scroll', onScroll, { passive: true });
    if (supportsScrollEnd) track.addEventListener('scrollend', recentre);
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(settle);
      track.removeEventListener('scroll', onScroll);
      track.removeEventListener('scrollend', recentre);
      window.removeEventListener('resize', onResize);
    };
  }, [measure, recentre, offset, step]);

  /** Scrolls so `card` is first, taking the shortest way round. */
  const goTo = (card: number) => {
    const track = trackRef.current;
    const width = step();
    if (!track || !width) return;
    const current = Math.round(track.scrollLeft / width);
    const candidates = loop ? [card, card + n, card + 2 * n] : [card];
    const target = candidates.reduce((best, c) => (Math.abs(c - current) < Math.abs(best - current) ? c : best));
    track.scrollTo({ left: target * width, behavior: 'smooth' });
  };

  const onScreen = (card: number) => (card - first + n) % n < visible;

  return (
    <section aria-label="Our assessments" className="mt-12 sm:mt-16 xl:u-mt-24">
      <motion.div initial="hidden" whileInView="shown" viewport={{ once: true, amount: 0.2 }}>
        <div
          ref={trackRef}
          tabIndex={0}
          role="region"
          aria-roledescription="carousel"
          aria-label="Assessments, scroll sideways for more"
          className={cn(
            'no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 py-6 scroll-px-5 sm:gap-6 sm:px-8 sm:scroll-px-8',
            'xl:u-gap-52 xl:u-px-200 xl:u-py-30 xl:u-scroll-px-200',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-violet',
            // Cards fade out towards the edges of the page.
            '[--fade-in:0px] [--fade-full:1.25rem] sm:[--fade-full:2rem] xl:[--fade-in:calc(var(--u)*88)] xl:[--fade-full:calc(var(--u)*165)]',
            '[mask-image:linear-gradient(to_right,transparent_var(--fade-in),#000_var(--fade-full),#000_calc(100%_-_var(--fade-full)),transparent_calc(100%_-_var(--fade-in)))]'
          )}
        >
          {slides.map((card, i) => {
            const isClone = loop && (i < offset || i >= offset + n);
            const position = i - offset;
            return (
              <motion.div
                key={i}
                ref={(el) => {
                  slideRefs.current[i] = el;
                }}
                aria-hidden={isClone || undefined}
                variants={slideVariants}
                custom={position >= 0 && position < 3 ? 0.1 + position * 0.12 : 0}
                className="flex w-[82%] shrink-0 snap-start sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)] xl:u-w-471"
              >
                <Card card={card} isClone={isClone} />
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {loop && (
        <Reveal from="fade" delay={0.4} className="mt-4 flex items-center justify-center gap-3 xl:u-mt-19 xl:u-gap-17">
          {cards.map((card, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show ${card.title.replace(/\s*\n\s*/g, ' ')}`}
              aria-current={i === first || undefined}
              className={cn(
                'h-4 w-4 cursor-pointer rounded-full transition-all duration-300 hover:scale-125 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-violet focus-visible:ring-offset-2 xl:u-size-20',
                onScreen(i) ? 'bg-brand-violet' : 'bg-brand-coral'
              )}
            />
          ))}
        </Reveal>
      )}
    </section>
  );
}
