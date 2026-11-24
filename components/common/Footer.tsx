'use client';

import Link from 'next/link';
import { Logo } from '@/components/common/Logo';
import { SocialLinks } from '@/components/common/SocialLinks';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { FOOTER_LINKS } from '@/constants';
import type { SettingsContent } from '@/lib/content/pages';

const linkClass = 'rounded transition-opacity hover:opacity-80 hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white';

/** The gradient footer card. Address, phone, socials and the credit line come from Site settings. */
export function Footer({ settings }: { settings: SettingsContent }) {
  const tel = settings.contact.phoneInternational.replace(/[^\d+]/g, '');

  return (
    <footer className="mx-auto mb-5 mt-16 w-[calc(100%-2.5rem)] sm:mb-8 sm:w-[calc(100%-4rem)] xl:mt-0 xl:u-mb-24 xl:u-w-1720">
      <Reveal from="up" className="relative isolate overflow-hidden rounded-[2rem] text-white xl:u-rounded-50">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-brand-purple bg-[url(/graphics/backgrounds/gradient.png)] bg-cover bg-center" />

        <div className="flex flex-col gap-12 px-7 py-12 sm:px-12 sm:py-14 lg:flex-row lg:items-start lg:justify-between xl:u-min-h-542 xl:gap-0 xl:u-pl-100 xl:u-pr-146 xl:u-pt-80 xl:u-pb-93">
          <div>
            <nav aria-labelledby="footer-quick-links">
              <h2 id="footer-quick-links" className="text-xl font-bold xl:u-text-30 xl:u-leading-34">
                Quick Links
              </h2>
              <Stagger stagger={0.08} className="mt-4 grid grid-cols-2 gap-x-8 gap-y-2 sm:grid-cols-3 sm:gap-x-10 xl:u-mt-5 xl:grid-cols-[calc(var(--u)*283)_calc(var(--u)*321)_auto] xl:gap-0">
                {FOOTER_LINKS.map((column, i) => (
                  <StaggerItem key={i} as="div">
                    <ul className="space-y-2 text-lg font-bold xl:space-y-0 xl:u-text-25 xl:u-leading-38">
                      {column.map((link) => (
                        <li key={link.href + link.label}>
                          <Link href={link.href} className={linkClass}>
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </StaggerItem>
                ))}
              </Stagger>
            </nav>

            <address className="mt-10 text-lg not-italic xl:u-mt-73 xl:u-text-25 xl:u-leading-30">
              <p className="font-bold">{settings.address.heading}</p>
              {settings.address.lines.map((line) => (
                <p key={line}>{line}</p>
              ))}
              {settings.contact.phone && (
                <p>
                  <a href={`tel:${tel}`} className={linkClass}>
                    {settings.contact.phone}
                  </a>
                </p>
              )}
            </address>

            <SocialLinks socials={settings.socials} className="mt-5 xl:u-mt-13" />
          </div>

          <div className="flex flex-col items-center text-center lg:items-center xl:u-mt-13">
            <Link href="/" aria-label={`${settings.siteName} home`} className="group block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
              <Logo label={settings.siteName} className="w-44 text-white transition-transform duration-500 ease-out group-hover:-rotate-3 group-hover:scale-105 xl:u-w-324" />
            </Link>
            <p className="mt-5 text-sm font-bold leading-snug xl:u-mt-30 xl:u-text-22 xl:u-leading-25 xl:tracking-[0.01em]">
              © {new Date().getFullYear()} {settings.siteName}
              <br />
              {settings.footerCredit}
            </p>
          </div>
        </div>
      </Reveal>
    </footer>
  );
}
