'use client';

import { Children, useCallback, useEffect, useRef, useState } from 'react';
import { motion, type Variants } from 'motion/react';
import { cn } from '@/lib/utils';

/** Each card rises in, one after another, the first time the row scrolls into view. */
export const swipeCardVariants: Variants = {
  hidden: { opacity: 0, y: 48 },
  shown: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 + i * 0.12 } }),
};

/** Sizes for a card in the row: one and a bit on phones, two then three across, and the design's width from `xl`. */
export const swipeCardSize = 'w-[82%] shrink-0 snap-start sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]';

/** How far a card may poke past the edge and still count as on screen, in px. */
const TOLERANCE = 8;

/**
 * A row of cards (About's mission/vision/values, Our Approach's steps, the
 * team): from `xl` up they sit side by side across `xlWidth` design units, as
 * in the designs; on smaller screens the row swipes. The dots are violet for
 * the cards on screen and coral for the rest, and scroll to a card when pressed.
 *
 * With `desktopCarousel` the row also scrolls from `xl` up: three cards show
 * at a time and the rest are reached by swiping, dragging with the mouse or
 * the dots. Give each child `custom={index}` and `variants={swipeCardVariants}`.
 */
export function SwipeRow({
  label,
  labels,
  className,
  xlWidth = 'xl:u-w-1520',
  desktopCarousel = false,
  children,
}: {
  label: string;
  labels: string[];
  className?: string;
  xlWidth?: string;
  /** Keep scrolling from `xl` up, three cards at a time, with the dots shown. */
  desktopCarousel?: boolean;
  children: React.ReactNode;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const count = Children.count(children);
  const [onScreen, setOnScreen] = useState<boolean[]>(() => Array.from({ length: count }, (_, i) => i === 0));

  const cards = () => Array.from(trackRef.current?.children ?? []) as HTMLElement[];

  /** Works out which cards are fully in view. */
  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    // The visible strip is the row's box less its side padding.
    const box = track.getBoundingClientRect();
    const style = getComputedStyle(track);
    const left = box.left + parseFloat(style.paddingLeft);
    const right = box.right - parseFloat(style.paddingRight);
    const next = (Array.from(track.children) as HTMLElement[]).map((card) => {
      const r = card.getBoundingClientRect();
      return r.left >= left - TOLERANCE && r.right <= right + TOLERANCE;
    });
    setOnScreen((prev) => (prev.length === next.length && prev.every((v, i) => v === next[i]) ? prev : next));
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    schedule();
    track.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [measure, count]);

  const scrollToCard = (i: number, behavior: ScrollBehavior = 'smooth') => {
    const track = trackRef.current;
    const [first, card] = [cards()[0], cards()[i]];
    if (track && first && card) track.scrollTo({ left: card.offsetLeft - first.offsetLeft, behavior });
  };

  // Dragging with the mouse (touch and trackpads scroll natively). Snapping is
  // paused while dragging, then the row settles on the nearest card.
  const drag = useRef<{ x: number; scroll: number; moved: boolean } | null>(null);
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!desktopCarousel || e.pointerType !== 'mouse' || e.button !== 0 || !track || track.scrollWidth <= track.clientWidth) return;
    drag.current = { x: e.clientX, scroll: track.scrollLeft, moved: false };
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    const d = drag.current;
    if (!d || !track) return;
    const dx = e.clientX - d.x;
    if (!d.moved && Math.abs(dx) > 5) {
      d.moved = true;
      try {
        track.setPointerCapture(e.pointerId);
      } catch {
        // The pointer has already gone; dragging still works while it's over the row.
      }
      track.style.scrollSnapType = 'none';
      track.style.cursor = 'grabbing';
    }
    if (d.moved) track.scrollLeft = d.scroll - dx;
  };
  const endDrag = () => {
    const track = trackRef.current;
    const d = drag.current;
    drag.current = null;
    if (!d?.moved || !track) return;
    // Settle on the card nearest the left edge, in the direction dragged.
    const start = cards()[0]?.offsetLeft ?? 0;
    const offsets = cards().map((c) => c.offsetLeft - start);
    const nearest = offsets.reduce((best, x, i) => (Math.abs(x - track.scrollLeft) < Math.abs(offsets[best] - track.scrollLeft) ? i : best), 0);
    track.style.cursor = '';
    scrollToCard(nearest);
    // Put snapping back once the smooth scroll has finished.
    window.setTimeout(() => {
      track.style.scrollSnapType = '';
    }, 450);
    // Don't treat the end of a drag as a click on a card.
    track.addEventListener('click', (ev) => ev.stopPropagation(), { capture: true, once: true });
  };

  return (
    <section aria-label={label} className={className}>
      <motion.div
        ref={trackRef}
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, amount: 0.2 }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className={cn(
          'no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 py-4 scroll-px-5 sm:gap-6 sm:px-8 sm:scroll-px-8',
          desktopCarousel
            ? // Room above and below for the cards' hover lift, which the scrolling row would otherwise clip.
              'xl:mx-auto xl:u-gap-53 xl:px-0 xl:py-6 xl:-my-6 xl:scroll-px-0 xl:cursor-grab'
            : 'xl:mx-auto xl:justify-between xl:gap-0 xl:overflow-visible xl:p-0',
          xlWidth
        )}
      >
        {children}
      </motion.div>

      {count > 1 && (
        <div
          className={cn(
            'mt-4 flex items-center justify-center gap-3',
            // From `xl` up the box is shorter than the dots so the next section sits where the design has it.
            desktopCarousel ? 'xl:u-mt-46 xl:u-h-12 xl:items-start xl:u-gap-17' : 'xl:hidden'
          )}
        >
          {labels.map((name, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollToCard(i)}
              aria-label={`Show ${name}`}
              aria-current={onScreen[i] || undefined}
              className={cn(
                'h-4 w-4 shrink-0 cursor-pointer rounded-full transition-all duration-300 hover:scale-125 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-violet focus-visible:ring-offset-2 xl:u-size-20',
                onScreen[i] ? 'bg-brand-violet' : 'bg-brand-coral'
              )}
            />
          ))}
        </div>
      )}
    </section>
  );
}
