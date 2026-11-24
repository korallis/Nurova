import { cn } from '@/lib/utils';

/** The long, thin arrow after "Learn More" links (public/graphics/icons/arrow-long.svg), in the current text colour. */
export function LongArrow({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-block aspect-[54/16] shrink-0 bg-current [mask-image:url(/graphics/icons/arrow-long.svg)] [mask-repeat:no-repeat] [mask-size:contain]',
        className
      )}
    />
  );
}
