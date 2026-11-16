'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ExternalLink, FileText, Inbox, LayoutDashboard, LogOut, Settings, Users } from 'lucide-react';
import { logout } from '@/lib/admin/auth-actions';
import type { AdminArea } from '@/lib/auth/permissions';
import { cn } from '@/lib/utils';

interface NavLink {
  href: string;
  label: string;
  icon: typeof Inbox;
  exact?: boolean;
  badge?: 'inbox';
  /** Only shown to admins with access to this area. */
  area?: AdminArea;
}

const LINKS: NavLink[] = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/admin/inbox', label: 'Inbox', icon: Inbox, badge: 'inbox', area: 'inbox' },
  { href: '/admin/content', label: 'Website content', icon: FileText, area: 'content' },
];

/**
 * `counts` are unread Inbox messages, shown as a badge.
 * `areas` are the parts of the dashboard this admin can use.
 */
export function AdminNav({ name, counts, areas, superAdmin }: { name: string; counts: { inbox: number }; areas: AdminArea[]; superAdmin: boolean }) {
  const pathname = usePathname();
  // Managers use the same page to change their own password.
  const links = [
    ...LINKS.filter((link) => !link.area || areas.includes(link.area)),
    { href: '/admin/users', label: superAdmin ? 'Admins' : 'Your account', icon: Users },
    // Email keys and where forms are sent: super admins only.
    ...(superAdmin ? [{ href: '/admin/settings', label: 'Settings', icon: Settings }] : []),
  ];

  return (
    <nav aria-label="Dashboard" className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto p-4 text-sm">
      {links.map(({ href, label, icon: Icon, exact, badge }: NavLink) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        const n = badge ? counts[badge] : 0;
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex items-center gap-2.5 rounded-lg px-3 py-2 font-semibold transition',
              active ? 'bg-white/15 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'
            )}
          >
            <Icon className="h-4 w-4" aria-hidden="true" /> {label}
            {n > 0 && (
              <span className="ml-auto rounded-full bg-brand-coral px-2 py-0.5 text-[11px] font-bold text-white">
                {n > 99 ? '99+' : n}
                <span className="sr-only"> new</span>
              </span>
            )}
          </Link>
        );
      })}

      <div className="mt-auto space-y-1 border-t border-white/15 pt-3">
        <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-2.5 rounded-lg px-3 py-2 font-semibold text-white/80 hover:bg-white/10 hover:text-white">
          <ExternalLink className="h-4 w-4" aria-hidden="true" /> View website
        </a>
        <form action={logout}>
          <button type="submit" className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 font-semibold text-white/80 hover:bg-white/10 hover:text-white">
            <LogOut className="h-4 w-4" aria-hidden="true" /> Sign out
          </button>
        </form>
        <p className="truncate px-3 pt-1 text-xs text-white/60">Signed in as {name}</p>
      </div>
    </nav>
  );
}
