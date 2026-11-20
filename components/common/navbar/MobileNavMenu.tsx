'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { ButtonLink } from '@/components/ui/button';
import { BOOK_LINK, CONTACT_LINK, NAV_LINKS, type NavLinkConfig, type PageId } from '@/constants';
import { cn } from '@/lib/utils';

const itemVariants = { hidden: { opacity: 0, x: -16 }, shown: { opacity: 1, x: 0 } };

/** A menu item, with a button that expands the pages under it. */
function MenuItem({ link, active, expanded, onToggle, onNavigate }: { link: NavLinkConfig; active: boolean; expanded: boolean; onToggle: () => void; onNavigate: () => void }) {
  return (
    <motion.li variants={itemVariants}>
      <div className={cn('flex items-center rounded-2xl transition-colors', active ? 'bg-brand-violet text-white' : 'text-brand-purple')}>
        <Link
          href={link.href}
          onClick={onNavigate}
          aria-current={active ? 'page' : undefined}
          className={cn('flex-1 rounded-2xl px-4 py-3 text-lg font-bold transition-colors', !active && 'hover:bg-brand-violet/10')}
        >
          {link.label}
        </Link>
        {link.dropdown && (
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={expanded}
            aria-controls={`mobile-menu-${link.id}`}
            aria-label={`${expanded ? 'Hide' : 'Show'} ${link.label} pages`}
            className={cn(
              'mr-1 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-violet',
              active ? 'hover:bg-white/15' : 'hover:bg-brand-violet/10'
            )}
          >
            <ChevronDown className={cn('h-5 w-5 transition-transform duration-300', expanded && 'rotate-180')} aria-hidden="true" />
          </button>
        )}
      </div>

      <AnimatePresence initial={false}>
        {link.dropdown && expanded && (
          <motion.div
            id={`mobile-menu-${link.id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <ul className="mx-2 mb-2 mt-1 space-y-0.5 rounded-2xl bg-brand-violet/10 p-2">
              {link.dropdown.map((item) => (
                <li key={item.href + item.label}>
                  <Link href={item.href} onClick={onNavigate} className="block rounded-xl px-3 py-2.5 font-semibold text-brand-purple transition-colors hover:bg-brand-violet hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}

/** The menu below `xl`, opened from the header. Folds open; its links slide in one after another. */
export function MobileNavMenu({ currentPage, onNavigate }: { currentPage: PageId; onNavigate: () => void }) {
  const [expanded, setExpanded] = useState<PageId | null>(null);
  const toggle = (id: PageId) => setExpanded((current) => (current === id ? null : id));

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
        {[...NAV_LINKS, CONTACT_LINK].map((link) => (
          <MenuItem
            key={link.id}
            link={link}
            active={currentPage === link.id}
            expanded={expanded === link.id}
            onToggle={() => toggle(link.id)}
            onNavigate={onNavigate}
          />
        ))}
        <motion.li variants={{ hidden: { opacity: 0, y: 8 }, shown: { opacity: 1, y: 0 } }} className="px-1 pt-4">
          <ButtonLink href={BOOK_LINK.href} onClick={onNavigate}>
            {BOOK_LINK.label}
          </ButtonLink>
        </motion.li>
      </motion.ul>
    </motion.nav>
  );
}
