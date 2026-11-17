import Link from 'next/link';
import { cn } from '@/lib/utils';

/*
 * The pill buttons from the designs. From `xl` up they're sized in design
 * units (see app/globals.css): 50px tall with 20px bold text at 1920px wide.
 */

const VARIANTS = {
  /** Coral, white text: the main call to action. */
  coral: 'bg-brand-coral text-white shadow-[0_6px_20px_rgba(247,86,88,0.22)] hover:shadow-[0_10px_26px_rgba(247,86,88,0.38)] focus-visible:ring-brand-coral',
  /** White, coral text: on the gradient cards. */
  white: 'bg-white text-brand-coral hover:shadow-[0_10px_24px_rgba(40,0,80,0.22)] focus-visible:ring-white',
  /** White, purple text: on coral cards. */
  whitePurple: 'bg-white text-brand-purple hover:shadow-[0_10px_24px_rgba(120,0,40,0.2)] focus-visible:ring-white',
  /** White outline: on the gradient cards. */
  outlineWhite: 'border-2 border-white text-white hover:bg-white/15 focus-visible:ring-white',
  /** Violet fill. */
  violet: 'bg-brand-violet text-white hover:shadow-[0_10px_24px_rgba(164,58,226,0.35)] focus-visible:ring-brand-violet',
  /** Deep purple fill. */
  purple: 'bg-brand-purple text-white hover:shadow-[0_10px_24px_rgba(108,6,154,0.35)] focus-visible:ring-brand-purple',
  /** Purple outline. */
  outlinePurple: 'border-2 border-brand-purple text-brand-purple hover:bg-brand-purple/8 focus-visible:ring-brand-purple',
} as const;

/*
 * Sizes are set here rather than overridden with `className`: the design-unit
 * utilities (u-*) aren't known to tailwind-merge, so two of them would clash.
 */
const SIZES = {
  default: 'h-11 px-5 text-[15px] xl:u-h-50 xl:u-px-20 xl:u-text-20',
  /** The menu bar that stays at the top while scrolling. */
  compact: 'h-10 px-4 text-sm xl:u-h-44 xl:u-px-18 xl:u-text-17',
} as const;

export type ButtonVariant = keyof typeof VARIANTS;
export type ButtonSize = keyof typeof SIZES;

export function buttonClass(variant: ButtonVariant = 'coral', className?: string, size: ButtonSize = 'default') {
  return cn(
    'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full font-bold transition duration-200 ease-out',
    SIZES[size],
    'hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
    VARIANTS[variant],
    className
  );
}

/** A pill-shaped link styled as a button. */
export function ButtonLink({
  href,
  variant = 'coral',
  size = 'default',
  className,
  children,
  ...rest
}: { href: string; variant?: ButtonVariant; size?: ButtonSize; className?: string; children: React.ReactNode } & Omit<
  React.ComponentProps<typeof Link>,
  'href' | 'className'
>) {
  return (
    <Link href={href} className={buttonClass(variant, className, size)} {...rest}>
      {children}
    </Link>
  );
}
