'use client';

import Link from 'next/link';
import { Stagger, StaggerItem } from '@/components/motion/Reveal';
import { ButtonLink } from '@/components/ui/button';
import { BOOK_LINK, CONTACT_LINK, NAV_LINKS, type PageId } from '@/constants';
import { cn } from '@/lib/utils';

/**
 * The menu from `xl` up: links as pills (the current page filled violet), then
 * Contact and "Book an Assessment". The full-size menu drops in on page load;
 * `compact` is the smaller copy in the bar that stays at the top while
 * scrolling, which slides in as a whole.
 */
export function DesktopNav({ currentPage, compact = false }: { currentPage: PageId; compact?: boolean }) {
  const size = compact ? 'xl:u-h-44 xl:u-px-17 xl:u-text-17' : 'xl:u-h-50 xl:u-px-22 xl:u-text-20';
  const isContact = currentPage === 'contact';

  const items = [
    ...NAV_LINKS.map((link) => {
      const active = currentPage === link.id;
      return {
        key: link.id,
        className: undefined,
        node: (
          <Link
            href={link.href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex items-center whitespace-nowrap rounded-full font-bold transition-colors duration-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-violet',
              size,
              active ? 'bg-brand-violet text-white' : 'text-brand-purple hover:bg-brand-violet/12'
            )}
          >
            {link.label}
          </Link>
        ),
      };
    }),
    {
      key: CONTACT_LINK.id,
      className: compact ? 'xl:u-ml-6' : 'xl:u-ml-5',
      node: (
        <Link
          href={CONTACT_LINK.href}
          aria-current={isContact ? 'page' : undefined}
          className={cn(
            'flex items-center whitespace-nowrap rounded-full border-[3px] border-brand-purple font-bold transition-colors duration-200',
            'hover:bg-brand-purple hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple focus-visible:ring-offset-2',
            compact ? 'xl:u-h-44 xl:u-px-15 xl:u-text-17' : 'xl:u-h-50 xl:u-px-16 xl:u-text-20',
            isContact ? 'bg-brand-purple text-white' : 'text-brand-purple'
          )}
        >
          {CONTACT_LINK.label}
        </Link>
      ),
    },
    {
      key: 'book',
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
            <li key={item.key} className={item.className}>
              {item.node}
            </li>
          ))}
        </ul>
      ) : (
        <Stagger as="ul" onLoad delay={0.15} stagger={0.05} className="flex items-center">
          {items.map((item) => (
            <StaggerItem as="li" key={item.key} from="fade" className={item.className}>
              {item.node}
            </StaggerItem>
          ))}
        </Stagger>
      )}
    </nav>
  );
}
