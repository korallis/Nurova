'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { ButtonLink } from '@/components/ui/button';
import { BOOK_LINK, CONTACT_LINK, NAV_LINKS, type PageId } from '@/constants';
import { cn } from '@/lib/utils';

/** The menu below `xl`, opened from the header. Folds open; its links slide in one after another. */
export function MobileNavMenu({ currentPage, onNavigate }: { currentPage: PageId; onNavigate: () => void }) {
  return (
    <motion.nav
      id="mobile-nav"
      aria-label="Main menu"
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden border-t border-brand-lilac/60 bg-white xl:hidden"
    >
      <motion.ul
        initial="hidden"
        animate="shown"
        variants={{ hidden: {}, shown: { transition: { staggerChildren: 0.04, delayChildren: 0.08 } } }}
        className="mx-auto max-h-[calc(100svh-5rem)] w-[calc(100%-2.5rem)] space-y-1 overflow-y-auto py-4 sm:w-[calc(100%-4rem)]"
      >
        {NAV_LINKS.map((link) => {
          const active = currentPage === link.id;
          return (
            <motion.li key={link.id} variants={{ hidden: { opacity: 0, x: -16 }, shown: { opacity: 1, x: 0 } }}>
              <Link
                href={link.href}
                onClick={onNavigate}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'block rounded-2xl px-4 py-3 text-lg font-bold transition-colors',
                  active ? 'bg-brand-violet text-white' : 'text-brand-purple hover:bg-brand-violet/10'
                )}
              >
                {link.label}
              </Link>
            </motion.li>
          );
        })}
        <motion.li variants={{ hidden: { opacity: 0, y: 8 }, shown: { opacity: 1, y: 0 } }} className="flex flex-wrap gap-3 px-1 pt-4">
          <ButtonLink href={CONTACT_LINK.href} variant="outlinePurple" onClick={onNavigate} aria-current={currentPage === 'contact' ? 'page' : undefined}>
            {CONTACT_LINK.label}
          </ButtonLink>
          <ButtonLink href={BOOK_LINK.href} onClick={onNavigate}>
            {BOOK_LINK.label}
          </ButtonLink>
        </motion.li>
      </motion.ul>
    </motion.nav>
  );
}
