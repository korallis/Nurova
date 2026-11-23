'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'motion/react';
import { LongArrow } from '@/components/common/LongArrow';
import { MultiLine } from '@/components/common/MultiLine';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { ButtonLink } from '@/components/ui/button';
import { ClosingCta } from '@/components/home/ClosingCta';
import { Swirl } from '@/components/home/Decorations';
import { container, gradient } from '@/components/home/homeStyles';
import { ROUTES } from '@/constants';
import type { TeamMember, TeamPageContent } from '@/lib/content/pages';
import { cn } from '@/lib/utils';
import { pageHeading, pageText } from './aboutStyles';
import { PageLabel } from './PageLabel';
import { SwipeRow, swipeCardSize, swipeCardVariants } from './SwipeRow';

/** "Clinical Director, Nurova" → "Clinical Director": the cards name the role without the organisation. */
const shortRole = (role: string) => role.replace(/,\s*Nurova(\s+Minds)?\s*$/i, '');

/** "Experienced professionals. Compassionate care.": white text over the photo, which sits under a violet tint. */
function TeamHero({ content }: { content: TeamPageContent['hero'] }) {
  const { image } = content;
  return (
    <section aria-labelledby="team-page-heading" className={cn(container, 'mt-4 xl:u-mt-124')}>
      <PageLabel>{content.label}</PageLabel>
      <Reveal onLoad from="zoom" delay={0.1} className="mt-5 xl:u-mt-37">
        <div className="relative isolate overflow-hidden rounded-[2rem] text-white xl:u-h-762 xl:u-rounded-50">
          {image?.src ? (
            <>
              {/* As in the design: the photo at 70% over violet. */}
              <div aria-hidden="true" className="absolute inset-0 -z-30 bg-brand-violet" />
              <Image src={image.src} alt={image.alt} fill priority sizes="(min-width: 1280px) 90vw, 100vw" className="-z-20 object-cover opacity-70" />
            </>
          ) : (
            <div aria-hidden="true" className={cn('absolute inset-0 -z-20', gradient)} />
          )}
          <Swirl delay={0.9} opacity={0.4} className="-z-10 left-[35%] top-[15%] w-[90%] -scale-x-100 rotate-180 sm:left-[50%] sm:w-[60%] xl:u-left-860 xl:u-top-130 xl:u-w-980" />

          <Stagger onLoad delay={0.4} stagger={0.15} className="relative px-7 pb-12 pt-12 sm:px-12 sm:pb-16 sm:pt-16 xl:u-max-w-1200 xl:u-pl-100 xl:u-pr-0 xl:u-pt-110 xl:u-pb-0">
            <StaggerItem>
              <h1 id="team-page-heading" className={pageHeading}>
                <MultiLine text={content.title} />
              </h1>
            </StaggerItem>
            <StaggerItem>
              <p className={cn(pageText, 'mt-5 max-w-xl xl:u-mt-20 xl:u-max-w-640')}>{content.body}</p>
            </StaggerItem>
            <StaggerItem className="mt-8 xl:u-mt-63">
              <ButtonLink href={ROUTES.contact} variant="whitePurple">
                {content.cta}
              </ButtonLink>
            </StaggerItem>
          </Stagger>
        </div>
      </Reveal>
    </section>
  );
}

const cardShape = 'relative block h-[26rem] w-full overflow-hidden rounded-[2rem] bg-brand-lilac sm:h-[28rem] xl:u-h-634 xl:u-rounded-40';

/** A member's photo with the frosted "Meet …, role" label; a button in the row, a plain card when opened. */
function PhotoCard({ member, onOpen, buttonRef }: { member: TeamMember; onOpen?: () => void; buttonRef?: (el: HTMLButtonElement | null) => void }) {
  const inner = (
    <>
      {member.image?.src ? (
        <Image
          src={member.image.src}
          alt=""
          fill
          sizes="(min-width: 1280px) 26vw, (min-width: 640px) 50vw, 85vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      ) : (
        <div aria-hidden="true" className={cn('absolute inset-0 rotate-180', gradient)} />
      )}
      <span className="absolute inset-x-4 bottom-4 flex min-h-24 flex-col justify-center rounded-[1.25rem] bg-white/75 px-5 py-4 pr-16 text-left backdrop-blur-md transition-colors duration-300 group-hover:bg-white/90 xl:u-bottom-33 xl:u-left-30 xl:u-right-30 xl:u-h-108 xl:u-rounded-25 xl:u-pl-27 xl:u-pr-30 xl:u-py-0">
        <span className="text-lg font-bold leading-snug text-brand-purple xl:u-text-30 xl:u-leading-35">
          Meet {member.name}, {shortRole(member.role)}
        </span>
        <LongArrow className="absolute bottom-5 right-5 w-12 text-brand-purple transition-transform duration-300 ease-out group-hover:translate-x-1.5 xl:u-bottom-22 xl:u-right-22 xl:u-w-54" />
      </span>
    </>
  );
  return onOpen ? (
    <button
      ref={buttonRef}
      type="button"
      onClick={onOpen}
      className={cn(cardShape, 'group cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-violet')}
    >
      {inner}
    </button>
  ) : (
    <div className={cardShape}>{inner}</div>
  );
}

/**
 * An opened member, as in the design: their photo card with a violet card
 * beside it holding their name, role and full bio; the back arrow returns to
 * the whole team.
 */
function OpenMember({ member, onBack }: { member: TeamMember; onBack: () => void }) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => heading.current?.focus(), []);
  const title = `Meet ${member.name}, ${shortRole(member.role)}`;

  return (
    <motion.div
      key={member.name}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      className="mx-auto grid w-[calc(100%-2.5rem)] gap-5 sm:w-[calc(100%-4rem)] sm:grid-cols-2 sm:gap-6 xl:w-auto xl:u-max-w-1012 xl:grid-cols-[calc(var(--u)*489)_calc(var(--u)*489)] xl:u-gap-34"
    >
      <motion.div initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
        <PhotoCard member={member} />
      </motion.div>
      <motion.section
        aria-labelledby="open-member-heading"
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className="flex min-h-[26rem] flex-col rounded-[2rem] bg-brand-violet p-7 text-white sm:min-h-[28rem] sm:p-9 xl:u-h-634 xl:u-rounded-40 xl:u-px-46 xl:u-pt-55 xl:u-pb-46"
      >
        <h2 id="open-member-heading" ref={heading} tabIndex={-1} className="text-2xl font-bold leading-tight focus:outline-none xl:u-text-34 xl:u-leading-40">
          {title}
        </h2>
        <p className="mt-5 whitespace-pre-line text-sm leading-relaxed xl:u-mt-26 xl:u-text-18 xl:u-leading-30">{member.bio}</p>
        <button
          type="button"
          onClick={onBack}
          className="group mt-auto inline-flex w-fit cursor-pointer items-center gap-3 rounded pt-6 font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <LongArrow className="w-12 rotate-180 transition-transform duration-300 ease-out group-hover:-translate-x-1.5 xl:u-w-54" />
          <span className="sr-only">Back to the whole team</span>
        </button>
      </motion.section>
    </motion.div>
  );
}

/** The team as photo cards; pressing one opens that person beside their photo. The people are edited on the About page. */
function TeamGrid({ members }: { members: TeamMember[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const cardRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const lastOpened = useRef<number | null>(null);

  const back = () => {
    lastOpened.current = open;
    setOpen(null);
  };

  // Escape returns to the team too.
  useEffect(() => {
    if (open === null) return;
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && back();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // `back` only reads `open`, which is a dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <div className="mt-12 sm:mt-16 xl:u-mt-102">
      <AnimatePresence
        mode="wait"
        initial={false}
        // Back on the row, put focus on the card that was opened.
        onExitComplete={() => {
          if (open === null && lastOpened.current !== null) cardRefs.current[lastOpened.current]?.focus();
        }}
      >
        {open !== null && members[open] ? (
          <OpenMember key="open" member={members[open]} onBack={back} />
        ) : (
          <motion.div key="row" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.2 } }}>
            <SwipeRow label="Our team" labels={members.map((m) => m.name)}>
              {members.map((member, i) => (
                <motion.div key={member.name + i} custom={i} variants={swipeCardVariants} className={cn(swipeCardSize, 'xl:u-w-489')}>
                  <PhotoCard
                    member={member}
                    onOpen={() => setOpen(i)}
                    buttonRef={(el) => {
                      cardRefs.current[i] = el;
                    }}
                  />
                </motion.div>
              ))}
            </SwipeRow>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Meet the team; the hero and closing come from "About › Meet the team", the people from the About page. */
export function TeamPageSections({ content, members }: { content: TeamPageContent; members: TeamMember[] }) {
  return (
    <div className="flex w-full flex-col overflow-x-clip">
      <TeamHero content={content.hero} />
      <TeamGrid members={members} />
      <div className="xl:u-h-43" aria-hidden="true" />
      <ClosingCta content={content.closing} variant="team" />
    </div>
  );
}
