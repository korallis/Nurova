'use client';

import Image from 'next/image';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { MultiLine } from '@/components/common/MultiLine';
import { pageHeading, pageText } from '@/components/about/aboutStyles';
import { ButtonLink } from '@/components/ui/button';
import { Swirl } from '@/components/home/Decorations';
import { container, gradient } from '@/components/home/homeStyles';
import type { Photo } from '@/lib/content/fields';
import { cn } from '@/lib/utils';

/**
 * A coral heading, text and button on the left with a pale lilac swirl behind
 * them, and a photo on the right ("Clinical governance & quality assurance",
 * "Why choose Nurova Minds?"). Without a photo the panel shows the gradient.
 */
export function SplitFeature({
  id,
  title,
  body,
  image,
  cta,
  className,
}: {
  id: string;
  title: string;
  body: string;
  image: Photo | null;
  cta: { label: string; href: string };
  className?: string;
}) {
  return (
    <section aria-labelledby={id} className={cn(container, 'relative isolate grid items-start gap-10 lg:grid-cols-2 xl:grid-cols-[1fr_calc(var(--u)*748)] xl:gap-0', className)}>
      <Swirl delay={0.3} opacity={1} color="#f3e6fb" strokeWidth={34} className="-z-10 hidden -scale-x-100 lg:block lg:left-[20%] lg:top-[-6%] lg:w-[60%] xl:u-left-430 xl:-u-top-80 xl:u-w-800" />

      <Stagger stagger={0.14} className="relative lg:py-8 xl:u-pl-100 xl:u-pr-40 xl:u-pt-63 xl:u-pb-0">
        <StaggerItem>
          <h2 id={id} className={cn(pageHeading, 'text-brand-coral')}>
            <MultiLine text={title} />
          </h2>
        </StaggerItem>
        <StaggerItem>
          <p className={cn(pageText, 'mt-5 text-brand-purple xl:u-mt-22 xl:u-max-w-840')}>{body}</p>
        </StaggerItem>
        <StaggerItem from="pop" className="mt-8 xl:u-mt-61">
          <ButtonLink href={cta.href}>{cta.label}</ButtonLink>
        </StaggerItem>
      </Stagger>

      <Reveal from="right" className="relative isolate min-h-72 overflow-hidden rounded-[2rem] sm:min-h-96 xl:u-h-643 xl:u-rounded-50">
        {image?.src ? (
          <Image src={image.src} alt={image.alt} fill sizes="(min-width: 1280px) 40vw, (min-width: 1024px) 50vw, 100vw" className="object-cover transition-transform duration-[1.2s] ease-out hover:scale-[1.03]" />
        ) : (
          <div aria-hidden="true" className={cn('absolute inset-0 rotate-180', gradient)}>
            <Swirl delay={0.4} strokeWidth={22} className="left-0 top-0 w-full" />
          </div>
        )}
      </Reveal>
    </section>
  );
}
