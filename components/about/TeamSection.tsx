'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'motion/react';
import { LongArrow } from '@/components/common/LongArrow';
import { Reveal } from '@/components/motion/Reveal';
import { ButtonLink } from '@/components/ui/button';
import { Spiral, Squiggle, Swirl } from '@/components/home/Decorations';
import { bodyText, container, gradient, sectionHeading } from '@/components/home/homeStyles';
import { ROUTES } from '@/constants';
import type { AboutContent } from '@/lib/content/pages';
import { cn } from '@/lib/utils';

const swap = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const } },
  exit: { opacity: 0, x: -24, transition: { duration: 0.25 } },
};

/**
 * "Meet Dr. Natalie Gillbanks": a photo beside a coral card, one team member
 * at a time. With more than one member, "Next" and the dots step through
 * them (the photo and card cross-fade).
 */
export function TeamSection({ content }: { content: AboutContent['team'] }) {
  const { members } = content;
  const [index, setIndex] = useState(0);
  const member = members[index % members.length];
  const many = members.length > 1;

  return (
    <section aria-labelledby="team-heading" aria-roledescription={many ? 'carousel' : undefined} className={cn(container, 'mt-16 sm:mt-20 xl:u-mt-170')}>
      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr] xl:grid-cols-[calc(var(--u)*761)_1fr] xl:u-gap-36">
        <Reveal from="left" className="relative isolate min-h-80 overflow-hidden rounded-[2rem] sm:min-h-96 xl:u-min-h-750 xl:u-rounded-40">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={index} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
              {member.image?.src ? (
                <Image src={member.image.src} alt={member.image.alt} fill sizes="(min-width: 1280px) 40vw, (min-width: 1024px) 45vw, 100vw" className="object-cover" />
              ) : (
                <div aria-hidden="true" className={cn('absolute inset-0 rotate-180', gradient)}>
                  <Swirl delay={0.4} strokeWidth={22} className="left-0 top-0 w-full" />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </Reveal>

        <Reveal from="right" delay={0.1} className="relative isolate flex flex-col overflow-hidden rounded-[2rem] bg-brand-coral px-7 py-10 text-white sm:px-12 sm:py-12 xl:u-rounded-50 xl:u-pl-63 xl:u-pr-52 xl:u-pt-55 xl:u-pb-52">
          {/* The first card has the spiral, the others the squiggle, as in the designs; redrawn on each change. */}
          {index === 0 ? (
            <Spiral key={index} color="#fff" opacity={0.2} delay={0.5} className="-z-10 left-[30%] top-[45%] w-56 xl:u-left-320 xl:u-top-380 xl:u-w-360" />
          ) : (
            <Squiggle key={index} color="#fff" opacity={0.2} delay={0.3} className="-z-10 left-[40%] top-[40%] w-56 xl:u-left-396 xl:u-top-315 xl:u-w-460" />
          )}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={index} {...swap} aria-live={many ? 'polite' : undefined}>
              <h2 id="team-heading" className={cn(sectionHeading, 'xl:u-max-w-560')}>
                Meet {member.name}
              </h2>
              <p className="mt-4 text-xl font-medium sm:text-2xl xl:u-mt-29 xl:u-text-45 xl:u-leading-46">{member.role}</p>
              <p className={cn(bodyText, 'mt-8 whitespace-pre-line xl:u-mt-58 xl:u-max-w-770 xl:u-leading-40')}>{member.bio}</p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 xl:mt-auto xl:u-pt-40">
            <ButtonLink href={ROUTES.team} variant="purple" className="xl:u-min-w-226">
              {content.cta}
            </ButtonLink>
            {many && (
              <button
                type="button"
                onClick={() => setIndex((i) => (i + 1) % members.length)}
                className="group inline-flex cursor-pointer items-center gap-4 rounded font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white xl:u-gap-18 xl:u-text-20"
              >
                {content.nextLabel}
                <span className="sr-only"> team member</span>
                <LongArrow className="w-12 transition-transform duration-300 ease-out group-hover:translate-x-1.5 xl:u-w-54" />
              </button>
            )}
          </div>
        </Reveal>
      </div>

      {/* Fixed height so the closing section sits where the design has it, with or without dots. */}
      <div className="relative h-10 xl:u-h-62">
        {many && (
          <div className="absolute inset-x-0 top-5 flex items-center justify-center gap-3 xl:u-top-55 xl:u-gap-17">
            {members.map((m, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show ${m.name}`}
                aria-current={i === index || undefined}
                className={cn(
                  'h-4 w-4 cursor-pointer rounded-full transition-all duration-300 hover:scale-125 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-violet focus-visible:ring-offset-2 xl:u-size-20',
                  i === index ? 'bg-brand-violet' : 'bg-brand-coral'
                )}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
