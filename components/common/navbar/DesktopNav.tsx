'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'motion/react';
import { Stagger, StaggerItem } from '@/components/motion/Reveal';
import { ButtonLink } from '@/components/ui/button';
import { BOOK_LINK, CONTACT_LINK, NAV_LINKS, type NavLinkConfig, type PageId } from '@/constants';
import { cn } from '@/lib/utils';

/** Long enough for the pointer to travel from a menu item into its dropdown. */
const CLOSE_DELAY_MS = 160;

/** The violet card listing an item's pages (no title: the menu item above it already names the section). */
function Dropdown({ link, align, onNavigate }: { link: NavLinkConfig; align: 'left' | 'right'; onNavigate: () => void }) {
  return (
    <motion.div
      id={`menu-${link.id}`}
      initial={{ opacity: 0, y: -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.98, transition: { duration: 0.12 } }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      // The padding-top bridges the gap under the menu item, so the pointer doesn't leave the item on the way in.
      className={cn('absolute top-full z-50 pt-3 xl:u-pt-12', align === 'right' ? 'right-0 origin-top-right' : 'left-0 origin-top-left')}
    >
      <div className="rounded-[1.25rem] bg-brand-violet text-white shadow-[0_18px_40px_rgba(108,6,154,0.28)] xl:u-min-w-300 xl:u-rounded-28 xl:u-px-28 xl:u-py-24">
        <ul>
          {link.dropdown!.map((item) => (
            <li key={item.href + item.label}>
              <Link
                href={item.href}
                onClick={onNavigate}
                className="block whitespace-nowrap rounded underline-offset-4 transition-opacity hover:underline hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white xl:u-text-19 xl:u-leading-26"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

/**
 * The menu from `xl` up: links as pills (the current page filled violet), then
 * Contact and "Book an Assessment". Items with pages under them open a violet
 * dropdown on hover or keyboard focus (Escape closes it). The full-size menu
 * drops in on page load; `compact` is the smaller copy in the bar that stays at
 * the top while scrolling, which slides in as a whole.
 */
export function DesktopNav({ currentPage, compact = false }: { currentPage: PageId; compact?: boolean }) {
  const size = compact ? 'xl:u-h-44 xl:u-px-17 xl:u-text-17' : 'xl:u-h-50 xl:u-px-22 xl:u-text-20';
  const [open, setOpen] = useState<PageId | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  // Escape hands focus back to the menu item; that focus shouldn't reopen the dropdown.
  const closedByEscape = useRef(false);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  const show = (id: PageId) => {
    clearTimeout(closeTimer.current);
    setOpen(id);
  };
  const hideSoon = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(null), CLOSE_DELAY_MS);
  };
  const hide = () => {
    clearTimeout(closeTimer.current);
    setOpen(null);
  };

  /** Hover, focus and Escape handling for an item with a dropdown. */
  const dropdownProps = (link: NavLinkConfig) =>
    link.dropdown
      ? {
          onMouseEnter: () => show(link.id),
          onMouseLeave: hideSoon,
          onFocus: () => {
            if (closedByEscape.current) closedByEscape.current = false;
            else show(link.id);
          },
          onBlur: (event: React.FocusEvent<HTMLElement>) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) hide();
          },
          onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => {
            if (event.key !== 'Escape' || open !== link.id) return;
            hide();
            closedByEscape.current = true;
            event.currentTarget.querySelector('a')?.focus();
          },
        }
      : {};

  /** The trigger's ARIA state, linking it to its dropdown. */
  const triggerProps = (link: NavLinkConfig) =>
    link.dropdown ? { 'aria-haspopup': true, 'aria-expanded': open === link.id, 'aria-controls': open === link.id ? `menu-${link.id}` : undefined } : {};

  const dropdownFor = (link: NavLinkConfig, align: 'left' | 'right') => (
    <AnimatePresence>{link.dropdown && open === link.id && <Dropdown link={link} align={align} onNavigate={hide} />}</AnimatePresence>
  );

  const isContact = currentPage === 'contact';
  const items = [
    ...NAV_LINKS.map((link, i) => {
      const active = currentPage === link.id;
      return {
        link,
        className: 'relative',
        node: (
          <>
            <Link
              href={link.href}
              onClick={hide}
              aria-current={active ? 'page' : undefined}
              {...triggerProps(link)}
              className={cn(
                'flex items-center whitespace-nowrap rounded-full font-bold transition-colors duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-violet',
                size,
                active || open === link.id ? 'bg-brand-violet text-white' : 'text-brand-purple hover:bg-brand-violet/12'
              )}
            >
              {link.label}
            </Link>
            {/* Dropdowns towards the right of the menu open leftwards so they stay on screen. */}
            {dropdownFor(link, i >= NAV_LINKS.length - 2 ? 'right' : 'left')}
          </>
        ),
      };
    }),
    {
      link: CONTACT_LINK,
      className: cn('relative', compact ? 'xl:u-ml-6' : 'xl:u-ml-5'),
      node: (
        <>
          <Link
            href={CONTACT_LINK.href}
            onClick={hide}
            aria-current={isContact ? 'page' : undefined}
            {...triggerProps(CONTACT_LINK)}
            className={cn(
              'flex items-center whitespace-nowrap rounded-full border-[3px] border-brand-purple font-bold transition-colors duration-200',
              'hover:bg-brand-purple hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple focus-visible:ring-offset-2',
              compact ? 'xl:u-h-44 xl:u-px-15 xl:u-text-17' : 'xl:u-h-50 xl:u-px-16 xl:u-text-20',
              isContact || open === CONTACT_LINK.id ? 'bg-brand-purple text-white' : 'text-brand-purple'
            )}
          >
            {CONTACT_LINK.label}
          </Link>
          {dropdownFor(CONTACT_LINK, 'right')}
        </>
      ),
    },
    {
      link: null,
      className: 'xl:u-ml-13',
      node: (
        <ButtonLink href={BOOK_LINK.href} size={compact ? 'compact' : 'default'}>
          {BOOK_LINK.label}
        </ButtonLink>
      ),
    },
  ];

  return (
    <nav aria-label={compact ? 'Main menu (compact)' : 'Main menu'}>
      {compact ? (
        <ul className="flex items-center">
          {items.map((item) => (
            <li key={item.link?.id ?? 'book'} className={item.className} {...(item.link ? dropdownProps(item.link) : {})}>
              {item.node}
            </li>
          ))}
        </ul>
      ) : (
        <Stagger as="ul" onLoad delay={0.15} stagger={0.05} className="flex items-center">
          {items.map((item) => (
            <StaggerItem as="li" key={item.link?.id ?? 'book'} from="fade" className={item.className}>
              {/* StaggerItem doesn't pass event handlers through, so they go on this wrapper. */}
              <div className="relative" {...(item.link ? dropdownProps(item.link) : {})}>
                {item.node}
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      )}
    </nav>
  );
}
