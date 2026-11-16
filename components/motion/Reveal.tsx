'use client';

import { motion, type Variants } from 'motion/react';

export type RevealFrom = 'up' | 'down' | 'left' | 'right' | 'zoom' | 'pop' | 'fade';

const OFFSET: Record<RevealFrom, Record<string, number>> = {
  up: { y: 48 },
  down: { y: -48 },
  left: { x: -64 },
  right: { x: 64 },
  zoom: { scale: 0.9 },
  pop: { scale: 0.6, rotate: -6 },
  fade: {},
};

const EASE = [0.22, 1, 0.36, 1] as const;

/** Hidden → shown variants. `custom` is the delay in seconds. */
function variants(from: RevealFrom): Variants {
  return {
    hidden: { opacity: 0, ...OFFSET[from] },
    shown: (delay: number = 0) => ({
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      rotate: 0,
      transition:
        from === 'pop'
          ? { type: 'spring', stiffness: 260, damping: 15, delay }
          : { duration: 0.8, ease: EASE, delay },
    }),
  };
}

function trigger(onLoad: boolean, amount = 0.2) {
  return onLoad ? { animate: 'shown' } : { whileInView: 'shown', viewport: { once: true, amount } };
}

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  from?: RevealFrom;
  delay?: number;
  /** Animate as soon as the page loads rather than when scrolled into view. */
  onLoad?: boolean;
  id?: string;
}

/**
 * Fades/slides its content in the first time it scrolls into view, or on page
 * load with `onLoad`. Put layout classes (positioning, size) on `className`:
 * the wrapper itself is what moves.
 */
export function Reveal({ children, className, from = 'up', delay = 0, onLoad = false, id }: RevealProps) {
  return (
    <motion.div id={id} className={className} variants={variants(from)} custom={delay} initial="hidden" {...trigger(onLoad)}>
      {children}
    </motion.div>
  );
}

interface StaggerProps {
  children: React.ReactNode;
  className?: string;
  /** Seconds between each child. */
  stagger?: number;
  delay?: number;
  onLoad?: boolean;
  as?: 'div' | 'ul';
}

/** Parent for `StaggerItem`s: the items animate in one after another. */
export function Stagger({ children, className, stagger = 0.1, delay = 0, onLoad = false, as = 'div' }: StaggerProps) {
  const Comp = as === 'ul' ? motion.ul : motion.div;
  return (
    <Comp
      className={className}
      initial="hidden"
      variants={{ hidden: {}, shown: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
      {...trigger(onLoad, 0.15)}
    >
      {children}
    </Comp>
  );
}

interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
  from?: RevealFrom;
  as?: 'div' | 'li';
  id?: string;
}

export function StaggerItem({ children, className, from = 'up', as = 'div', id }: StaggerItemProps) {
  const Comp = as === 'li' ? motion.li : motion.div;
  return (
    <Comp id={id} className={className} variants={variants(from)}>
      {children}
    </Comp>
  );
}
