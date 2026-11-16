'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { StaggerItem } from '@/components/motion/Reveal';
import type { SettingsContent } from '@/lib/content/pages';
import { cn } from '@/lib/utils';
import { EnquiryForm } from './EnquiryForm';
import { NewsletterForm } from './NewsletterForm';
import { Backdrop, BrandLockup, GlassCard, Hero, SocialLinks, coralButton } from './parts';

const cardHeading = 'text-balance text-[clamp(2.25rem,3.65vw,4.375rem)] font-bold leading-[1.3]';
const cardText = 'mt-[clamp(16px,1.6vw,30px)] text-[clamp(1.05rem,1.46vw,1.75rem)] leading-[1.36]';

/** How one screen hands over to the next. */
const screen = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.6 } },
  exit: { opacity: 0, y: -24, transition: { duration: 0.45, ease: [0.4, 0, 1, 1] as const } },
};

/** The thank-you screen. Starts at the top of the page with focus on its heading, since the form was far down. */
function EnquirySent({ settings }: { settings: SettingsContent }) {
  const { siteName, tagline, socials, enquirySent } = settings;
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    heading.current?.focus();
  }, []);

  return (
    <motion.main key="sent" {...screen} className="relative isolate flex min-h-svh w-full items-center overflow-hidden py-16 text-white">
      <Backdrop />
      <Hero
        lockup={<BrandLockup siteName={siteName} tagline={tagline} />}
        card={
          <GlassCard>
            <StaggerItem>
              <h1 ref={heading} tabIndex={-1} className={cn(cardHeading, 'focus:outline-none')}>
                {enquirySent.heading}
              </h1>
            </StaggerItem>
            <StaggerItem>
              <p className={cardText}>{enquirySent.body}</p>
            </StaggerItem>
            <StaggerItem className="mt-[clamp(28px,3.8vw,72px)] flex flex-wrap items-center gap-x-6 gap-y-10">
              <NewsletterForm
                source="enquiry-confirmation"
                buttonLabel={enquirySent.subscribeLabel}
                successMessage={enquirySent.subscribedMessage}
                className="max-w-[432px] flex-1 basis-64"
              />
              <SocialLinks socials={socials} />
            </StaggerItem>
          </GlassCard>
        }
      />
    </motion.main>
  );
}

/**
 * The pre-launch page (see next.config.ts): an introduction and the "Get in
 * touch" form, swapped for a thank-you screen once an enquiry is sent. Every
 * word comes from Site settings in the dashboard.
 */
export function ComingSoon({ settings }: { settings: SettingsContent }) {
  const { siteName, tagline, socials, comingSoon } = settings;
  const [sent, setSent] = useState(false);
  const showSent = useCallback(() => setSent(true), []);

  return (
    // Respects the visitor's reduced-motion setting: things fade instead of moving.
    <MotionConfig reducedMotion="user">
      <AnimatePresence mode="wait" initial={false}>
        {sent ? (
          <EnquirySent key="sent" settings={settings} />
        ) : (
          <motion.main key="form" {...screen} className="relative isolate w-full overflow-hidden pb-[clamp(64px,8vw,160px)] text-white">
            <Backdrop flipped />
            <div className="flex min-h-svh items-center py-16 lg:min-h-[min(100svh,980px)]">
              <Hero
                lockup={<BrandLockup siteName={siteName} tagline={tagline} />}
                card={
                  <GlassCard>
                    <StaggerItem>
                      <h1 className={cardHeading}>{comingSoon.title}</h1>
                    </StaggerItem>
                    <StaggerItem>
                      <p className={cardText}>{comingSoon.intro}</p>
                    </StaggerItem>
                    <StaggerItem className="mt-[clamp(24px,1.9vw,36px)] flex flex-wrap items-center justify-between gap-6">
                      <a href="#get-in-touch" className={cn(coralButton, 'h-[50px] text-[clamp(1.1rem,1.25vw,1.5rem)]')}>
                        {comingSoon.ctaLabel}
                      </a>
                      <SocialLinks socials={socials} />
                    </StaggerItem>
                  </GlassCard>
                }
              />
            </div>

            <EnquiryForm heading={comingSoon.formHeading} submitLabel={comingSoon.submitLabel} onSent={showSent} />
          </motion.main>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
