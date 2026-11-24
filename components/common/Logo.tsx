import { cn } from '@/lib/utils';

/**
 * The stacked "nurova minds" logo (public/graphics/logo/stacked.svg), shown
 * in the current text colour so it can be purple in the header and white in
 * the footer. The file is used as a mask over a block of that colour.
 */
export function Logo({ label = 'Nurova Minds', className }: { label?: string; className?: string }) {
  return (
    <span
      role="img"
      aria-label={label}
      className={cn(
        'block aspect-[503.76/429.28] bg-current [mask-image:url(/graphics/logo/stacked.svg)] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]',
        className
      )}
    />
  );
}
