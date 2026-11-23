'use client';

import { Reveal } from '@/components/motion/Reveal';

/** The coral label above an About page hero ("About Nurova Minds", "Our Approach"…); slides in on load. */
export function PageLabel({ children }: { children: React.ReactNode }) {
  return (
    <Reveal onLoad from="left">
      <p className="inline-flex h-11 items-center rounded-full bg-brand-coral px-5 text-base font-bold text-white xl:u-h-62 xl:u-px-24 xl:u-text-30">{children}</p>
    </Reveal>
  );
}
