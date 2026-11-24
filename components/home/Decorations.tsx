'use client';

import { motion, useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';

/*
 * The hand-drawn brand strokes, drawn in as they appear. The shapes live in
 * public/graphics/strokes/ (each file's line has id="stroke"); they're placed
 * here with <use>, which inherits the colour, width and dash settings set on
 * it, so animating the dash draws the line in. Coordinates are design pixels
 * inside each file's viewBox, so a box sized in design units reproduces the design.
 */

type StrokeName = 'swirl' | 'brush' | 'spiral' | 'squiggle' | 'wave-left' | 'wave-right';

const VIEW_BOXES: Record<StrokeName, string> = {
  swirl: '0 0 940 660',
  brush: '0 0 490 80',
  spiral: '0 0 400 370',
  squiggle: '0 0 460 420',
  'wave-left': '0 0 460 400',
  'wave-right': '0 0 580 520',
};

interface StrokeProps {
  className?: string;
  /** In design pixels at the shape's design size. */
  strokeWidth?: number;
  delay?: number;
}

/** Draws once, the first time it scrolls into view. */
function DrawnStroke({
  name,
  color,
  opacity = 1,
  strokeWidth,
  delay = 0,
  duration = 1.8,
  className,
}: StrokeProps & { name: StrokeName; color: string; opacity?: number; duration?: number }) {
  const reduced = useReducedMotion();
  const [, , w, h] = VIEW_BOXES[name].split(' ');
  return (
    <svg viewBox={VIEW_BOXES[name]} aria-hidden="true" style={{ aspectRatio: `${w} / ${h}` }} className={cn('pointer-events-none absolute overflow-visible', className)}>
      <motion.use
        href={`/graphics/strokes/${name}.svg#stroke`}
        // The file's line has pathLength="1", so a dash of 1 is the whole line.
        style={{ color, strokeOpacity: opacity, strokeWidth, strokeDasharray: '1 1' }}
        // Reduced motion: shown fully drawn.
        initial={{ strokeDashoffset: reduced ? 0 : 1 }}
        whileInView={{ strokeDashoffset: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration, ease: 'easeInOut', delay }}
      />
    </svg>
  );
}

/** The translucent white swirl behind the photos. Size the box with `className` (its aspect ratio is fixed). */
export function Swirl({ className, strokeWidth = 28, delay = 0.5, opacity = 0.32, color = '#fff' }: StrokeProps & { opacity?: number; color?: string }) {
  return <DrawnStroke name="swirl" color={color} opacity={opacity} strokeWidth={strokeWidth} delay={delay} duration={2.4} className={className} />;
}

/** The pink brush stroke under the home page quote. */
export function BrushUnderline({ className, delay = 0.6 }: StrokeProps) {
  return <DrawnStroke name="brush" color="var(--color-brand-pink)" strokeWidth={22} delay={delay} duration={1.1} className={className} />;
}

/** The spiral by the closing call to action; draws itself as the section comes into view. */
export function Spiral({ className, color = 'var(--color-brand-coral)', opacity = 1, delay = 0.2 }: { className?: string; color?: string; opacity?: number; delay?: number }) {
  return <DrawnStroke name="spiral" color={color} opacity={opacity} strokeWidth={28} delay={delay} duration={1.6} className={className} />;
}

/** The squiggle that runs on over the top of the footer; draws just after the spiral. */
export function Squiggle({ className, color = 'var(--color-brand-coral)', opacity = 1, delay = 0.6 }: { className?: string; color?: string; opacity?: number; delay?: number }) {
  return <DrawnStroke name="squiggle" color={color} opacity={opacity} strokeWidth={28} delay={delay} duration={1.6} className={className} />;
}

/** The two waves by the Meet the Team page's closing call to action. */
export function WaveLeft({ className, color = 'var(--color-brand-coral)' }: { className?: string; color?: string }) {
  return <DrawnStroke name="wave-left" color={color} strokeWidth={28} delay={0.2} duration={1.6} className={className} />;
}

export function WaveRight({ className, color = 'var(--color-brand-coral)' }: { className?: string; color?: string }) {
  return <DrawnStroke name="wave-right" color={color} strokeWidth={28} delay={0.6} duration={1.8} className={className} />;
}
