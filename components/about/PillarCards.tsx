'use client';

import Image from 'next/image';
import { motion } from 'motion/react';
import { MultiLine } from '@/components/common/MultiLine';
import type { AboutPillar } from '@/lib/content/pages';
import { cn } from '@/lib/utils';
import { SwipeRow, swipeCardSize, swipeCardVariants } from './SwipeRow';

/** "Our mission / vision / values": violet cards with a cut-out photo standing in the corner. */
export function PillarCards({ pillars }: { pillars: AboutPillar[] }) {
  return (
    <SwipeRow label="Our mission, vision and values" labels={pillars.map((p) => p.title.replace(/\s*\n\s*/g, ' '))} className="mt-12 sm:mt-16 xl:u-mt-99">
      {pillars.map((pillar, i) => (
        <motion.article
          key={i}
          custom={i}
          variants={swipeCardVariants}
          className={cn(
            swipeCardSize,
            'group relative flex min-h-[24rem] flex-col overflow-hidden rounded-[1.75rem] bg-brand-violet p-7 text-white transition-shadow duration-300 hover:shadow-[0_18px_40px_rgba(164,58,226,0.35)] xl:u-h-580 xl:u-w-471 xl:u-rounded-30 xl:u-px-46 xl:u-pt-50'
          )}
        >
          {pillar.image?.src && (
            <Image
              src={pillar.image.src}
              alt={pillar.image.alt}
              width={pillar.image.width || 600}
              height={pillar.image.height || 600}
              sizes="(min-width: 1280px) 25vw, 80vw"
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
    </SwipeRow>
  );
}
