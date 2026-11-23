'use client';

import { Children, useEffect, useRef, useState } from 'react';
import { motion, type Variants } from 'motion/react';
import { cn } from '@/lib/utils';

/** Each card rises in, one after another, the first time the row scrolls into view. */
export const swipeCardVariants: Variants = {
  hidden: { opacity: 0, y: 48 },
  shown: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 + i * 0.12 } }),
};

/** Sizes for a card in the row: one and a bit on phones, two then three across, and the design's width from `xl`. */
export const swipeCardSize = 'w-[82%] shrink-0 snap-start sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]';

/**
 * A row of cards (About's mission/vision/values, Our Approach's steps, the
 * team): from `xl` up they sit side by side across `width` design units, as in
 * the designs; on smaller screens the row swipes, with dots for the card in
 * view. Give each child `custom={index}` and `variants={swipeCardVariants}`.
 */
export function SwipeRow({ label, labels, className, xlWidth = 'xl:u-w-1520', children }: { label: string; labels: string[]; className?: string; xlWidth?: string; children: React.ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const count = Children.count(children);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const [first, second] = [track.children[0], track.children[1]] as (HTMLElement | undefined)[];
        const step = first && second ? second.offsetLeft - first.offsetLeft : 0;
        if (step) setCurrent(Math.round(track.scrollLeft / step));
      });
    };
    track.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener('scroll', onScroll);
    };
  }, []);

  const goTo = (i: number) => {
    const track = trackRef.current;
    const [first, card] = [track?.children[0], track?.children[i]] as (HTMLElement | undefined)[];
    if (track && first && card) track.scrollTo({ left: card.offsetLeft - first.offsetLeft, behavior: 'smooth' });
  };

  return (
    <section aria-label={label} className={className}>
      <motion.div
        ref={trackRef}
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, amount: 0.2 }}
        className={cn(
          'no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 py-4 scroll-px-5 sm:gap-6 sm:px-8 sm:scroll-px-8',
          'xl:mx-auto xl:justify-between xl:gap-0 xl:overflow-visible xl:p-0',
          xlWidth
        )}
      >
        {children}
      </motion.div>

      {/* Dots for the swipeable row below `xl`. */}
      {count > 1 && (
        <div className="mt-4 flex items-center justify-center gap-3 xl:hidden">
          {labels.map((name, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show ${name}`}
              aria-current={i === current || undefined}
              className={cn(
                'h-4 w-4 cursor-pointer rounded-full transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-violet focus-visible:ring-offset-2',
                i === current ? 'bg-brand-violet' : 'bg-brand-coral'
              )}
            />
          ))}
        </div>
      )}
    </section>
  );
}
