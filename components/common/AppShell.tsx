'use client';

import { usePathname } from 'next/navigation';
import { MotionConfig } from 'motion/react';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { activePage } from '@/constants';
import type { SiteChrome } from '@/lib/content/chrome-types';

/** Header, page and footer for every public page (app/(site)/layout.tsx). */
export function AppShell({ children, chrome }: { children: React.ReactNode; chrome: SiteChrome }) {
  const pathname = usePathname();

  return (
    // reducedMotion="user": every animation respects the device's reduce-motion setting.
    <MotionConfig reducedMotion="user">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-brand-purple focus:px-5 focus:py-3 focus:font-bold focus:text-white"
      >
        Skip to content
      </a>
      <Navbar currentPage={activePage(pathname)} siteName={chrome.settings.siteName} />
      <main id="main" className="flex w-full flex-1 flex-col">
        {children}
      </main>
      <Footer settings={chrome.settings} />
    </MotionConfig>
  );
}
