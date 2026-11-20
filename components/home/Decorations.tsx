'use client';

import { motion, useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';

/*
 * The hand-drawn strokes from the home page design, traced from it and drawn
 * in as they appear. Coordinates are design pixels inside each shape's box, so
 * a box sized in design units reproduces the design.
 */

/** The brand swirl: in from the top, down into a dip, up and round a big loop. */
const SWIRL = 'M 0 0 C 110 30, 210 80, 240 170 C 260 230, 250 310, 300 350 C 340 382, 400 370, 460 340 C 560 290, 690 220, 810 225 C 900 230, 930 310, 890 390 C 850 460, 790 510, 750 570 C 730 600, 720 620, 715 660';
/** The pink brush stroke under the quote. */
const BRUSH = 'M 12 68 C 45 48, 90 34, 135 35 C 185 36, 215 64, 250 70 C 290 76, 330 58, 380 38 C 420 22, 450 14, 477 10';
/** The coral spiral by the closing call to action. */
const SPIRAL = 'M 30 195 C 55 270, 120 330, 205 338 C 290 345, 350 280, 362 210 C 375 130, 340 50, 270 25 C 200 2, 145 45, 140 100 C 135 150, 175 190, 230 195 C 275 198, 300 160, 285 128 C 275 106, 250 102, 232 104';
/** The coral squiggle that runs down into the footer. */
const SQUIGGLE = 'M 428 152 C 405 90, 350 25, 290 22 C 235 20, 212 70, 222 130 C 230 180, 268 230, 262 262 C 255 290, 220 302, 185 292 C 150 282, 120 255, 85 262 C 45 270, 30 320, 35 390';

interface StrokeProps {
  className?: string;
  /** In design pixels at the shape's design size. */
  strokeWidth?: number;
  delay?: number;
}

/** Draws once, the first time it scrolls into view. */
function DrawnStroke({ d, viewBox, color, opacity = 1, strokeWidth, delay = 0, duration = 1.8, className }: StrokeProps & { d: string; viewBox: string; color: string; opacity?: number; duration?: number }) {
  const reduced = useReducedMotion();
  return (
    <svg viewBox={viewBox} aria-hidden="true" className={cn('pointer-events-none absolute overflow-visible', className)}>
      <motion.path
        d={d}
        fill="none"
        stroke={color}
        strokeOpacity={opacity}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={reduced ? false : { pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration, ease: 'easeInOut', delay }}
      />
    </svg>
  );
}

/** The translucent white swirl behind the photos. Size the box with `className` (its aspect ratio is fixed). */
export function Swirl({ className, strokeWidth = 28, delay = 0.5, opacity = 0.32 }: StrokeProps & { opacity?: number }) {
  return (
    <DrawnStroke d={SWIRL} viewBox="0 0 940 660" color="#fff" opacity={opacity} strokeWidth={strokeWidth} delay={delay} duration={2.4} className={cn('aspect-[940/660]', className)} />
  );
}

export function BrushUnderline({ className, delay = 0.6 }: StrokeProps) {
  return <DrawnStroke d={BRUSH} viewBox="0 0 490 80" color="var(--color-brand-pink)" strokeWidth={22} delay={delay} duration={1.1} className={cn('aspect-[490/80]', className)} />;
}

/** The spiral by the closing call to action (coral on Home, pink on About); draws itself as the section comes into view. */
export function Spiral({ className, color = 'var(--color-brand-coral)', opacity = 1, delay = 0.2 }: { className?: string; color?: string; opacity?: number; delay?: number }) {
  return <DrawnStroke d={SPIRAL} viewBox="0 0 400 370" color={color} opacity={opacity} strokeWidth={28} delay={delay} duration={1.6} className={cn('aspect-[400/370]', className)} />;
}

/** The squiggle that runs on over the top of the footer; draws just after the spiral. */
export function Squiggle({ className, color = 'var(--color-brand-coral)', opacity = 1, delay = 0.6 }: { className?: string; color?: string; opacity?: number; delay?: number }) {
  return <DrawnStroke d={SQUIGGLE} viewBox="0 0 460 420" color={color} opacity={opacity} strokeWidth={28} delay={delay} duration={1.6} className={cn('aspect-[460/420]', className)} />;
}
