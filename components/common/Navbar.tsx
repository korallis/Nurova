'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { Logo } from '@/components/common/Logo';
import { DesktopNav } from '@/components/common/navbar/DesktopNav';
import { MobileNavMenu } from '@/components/common/navbar/MobileNavMenu';
import { ButtonLink } from '@/components/ui/button';
import { BOOK_LINK, type PageId } from '@/constants';
import { cn } from '@/lib/utils';

/**
 * From `xl` up: the full-size header from the design (big logo, menu pills)
 * scrolls away with the page, and a compact bar slides down in its place so
 * the menu stays at the top. Below `xl`: a sticky bar with a menu button.
 */
export function Navbar({ currentPage, siteName }: { currentPage: PageId; siteName: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  // True once the full-size header has scrolled out of view.
  const [stuck, setStuck] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setStuck(window.scrollY > Math.max((barRef.current?.offsetHeight ?? 0) - 24, 24)));
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  // Escape closes the mobile menu.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const close = () => setMenuOpen(false);
  const homeLabel = `${siteName} home`;

  return (
    <header className={cn('sticky top-0 z-40 w-full bg-white transition-shadow duration-300 xl:static', stuck && 'shadow-[0_6px_24px_rgba(60,0,90,0.08)] xl:shadow-none')}>
      <div
        ref={barRef}
        className="mx-auto flex h-20 w-[calc(100%-2.5rem)] items-center justify-between gap-4 sm:w-[calc(100%-4rem)] xl:h-auto xl:u-w-1720 xl:items-start xl:u-pt-100"
      >
        <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 220, damping: 18 }}>
          <Link href="/" onClick={close} aria-label={homeLabel} className="block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-violet">
            <Logo label={siteName} className="w-[3.75rem] text-brand-purple xl:-u-ml-1 xl:u-w-194" />
          </Link>
        </motion.div>

        <div className="hidden xl:block xl:u-mt-86">
          <DesktopNav currentPage={currentPage} />
        </div>

        <div className="flex items-center gap-2 xl:hidden">
          <ButtonLink href={BOOK_LINK.href} size="compact" onClick={close} className="max-[359px]:hidden">
            {BOOK_LINK.label}
          </ButtonLink>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-brand-purple transition hover:bg-brand-violet/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-violet"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={menuOpen ? 'close' : 'open'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </div>

      <AnimatePresence>{menuOpen && <MobileNavMenu currentPage={currentPage} onNavigate={close} />}</AnimatePresence>

      {/* Compact bar from `xl` up, once the full header has scrolled away */}
      <AnimatePresence>
        {stuck && (
          <motion.div
            key="compact-nav"
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="fixed inset-x-0 top-0 z-50 hidden bg-white/95 shadow-[0_6px_24px_rgba(60,0,90,0.1)] backdrop-blur xl:block"
          >
            <div className="mx-auto flex items-center justify-between xl:u-w-1720 xl:u-py-12">
              <Link href="/" aria-label={homeLabel} className="block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-violet">
                <motion.span className="block" whileHover={{ rotate: -4, scale: 1.06 }}>
                  <Logo label={siteName} className="text-brand-purple xl:u-w-84" />
                </motion.span>
              </Link>
              <DesktopNav currentPage={currentPage} compact />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
