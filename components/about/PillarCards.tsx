'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, type Variants } from 'motion/react';
import { MultiLine } from '@/components/common/MultiLine';
import type { AboutPillar } from '@/lib/content/pages';
import { cn } from '@/lib/utils';

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 48 },
  shown: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 + i * 0.12 } }),
};

/**
 * "Our mission / vision / values": violet cards with a cut-out photo in the
 * corner. From `xl` up all three sit in a row, as in the design; on smaller
 * screens they're a swipeable row with dots showing which card is in view.
 */
export function PillarCards({ pillars }: { pillars: AboutPillar[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const first = track.children[0] as HTMLElement | undefined;
        const second = track.children[1] as HTMLElement | undefined;
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
    const card = trackRef.current?.children[i] as HTMLElement | undefined;
    const first = trackRef.current?.children[0] as HTMLElement | undefined;
    if (card && first) trackRef.current?.scrollTo({ left: card.offsetLeft - first.offsetLeft, behavior: 'smooth' });
  };

  return (
    <section aria-label="Our mission, vision and values" className="mt-12 sm:mt-16 xl:u-mt-99">
      <motion.div
        ref={trackRef}
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, amount: 0.2 }}
        className={cn(
          'no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 py-4 scroll-px-5 sm:gap-6 sm:px-8 sm:scroll-px-8',
          'xl:mx-auto xl:overflow-visible xl:u-w-1520 xl:justify-between xl:gap-0 xl:p-0'
        )}
      >
        {pillars.map((pillar, i) => (
          <motion.article
            key={i}
            custom={i}
            variants={cardVariants}
            className="group relative flex min-h-[24rem] w-[82%] shrink-0 snap-start flex-col overflow-hidden rounded-[1.75rem] bg-brand-violet p-7 text-white transition-shadow duration-300 hover:shadow-[0_18px_40px_rgba(164,58,226,0.35)] sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)] xl:u-h-580 xl:u-w-471 xl:u-rounded-30 xl:u-px-46 xl:u-pt-50"
          >
            {pillar.image?.src && (
              <Image
                src={pillar.image.src}
                alt={pillar.image.alt}
                width={pillar.image.width || 600}
                height={pillar.image.height || 600}
                sizes="(min-width: 1280px) 20vw, 60vw"
                className="pointer-events-none absolute bottom-0 right-0 h-auto w-full origin-bottom-right object-contain object-bottom transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              />
            )}
            <h3 className="relative text-5xl font-bold leading-[1] xl:u-text-80 xl:u-leading-80">
              <MultiLine text={pillar.title} always />
            </h3>
            <p className="relative mt-3 max-w-[13rem] text-base leading-snug xl:u-mt-13 xl:max-w-none xl:u-w-230 xl:u-text-25 xl:u-leading-35">
              <MultiLine text={pillar.body} />
            </p>
          </motion.article>
        ))}
      </motion.div>

      {/* Dots for the swipeable row below `xl`. */}
      {pillars.length > 1 && (
        <div className="mt-4 flex items-center justify-center gap-3 xl:hidden">
          {pillars.map((pillar, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show ${pillar.title.replace(/\s*\n\s*/g, ' ')}`}
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
