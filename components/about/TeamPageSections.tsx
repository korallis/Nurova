'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
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
              <Image src={image.src} alt={image.alt} fill priority sizes="(min-width: 1280px) 90vw, 100vw" className="-z-20 object-cover" />
              <div aria-hidden="true" className="absolute inset-0 -z-10 bg-brand-violet/55 mix-blend-multiply" />
              <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-purple/35 to-transparent" />
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

/** A team member's full card, opened from the grid. */
function MemberDialog({ member, onClose }: { member: TeamMember | null; onClose: () => void }) {
  return (
    <Dialog open={member !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl gap-0 overflow-hidden border-0 p-0 md:grid-cols-[2fr_3fr] [&>button:last-child]:text-white [&>button:last-child]:hover:bg-white/15 [&>button:last-child]:hover:text-white">
        {member && (
          <>
            <div className="relative min-h-64 bg-brand-lilac md:min-h-full">
              {member.image?.src ? (
                <Image src={member.image.src} alt={member.image.alt} fill sizes="(min-width: 768px) 360px, 100vw" className="object-cover" />
              ) : (
                <div aria-hidden="true" className={cn('absolute inset-0 rotate-180', gradient)} />
              )}
            </div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="bg-brand-coral p-7 text-white sm:p-10"
            >
              <DialogTitle className="pr-8 text-3xl font-bold leading-tight text-white sm:text-4xl">{member.name}</DialogTitle>
              <p className="mt-2 text-lg font-medium sm:text-xl">{member.role}</p>
              <DialogDescription className="mt-6 whitespace-pre-line text-base leading-relaxed text-white">{member.bio}</DialogDescription>
            </motion.div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

/** The team as photo cards; each opens the person's full card. The people are edited on the About page. */
function TeamGrid({ members }: { members: TeamMember[] }) {
  const [open, setOpen] = useState<TeamMember | null>(null);
  return (
    <>
      <SwipeRow label="Our team" labels={members.map((m) => m.name)} className="mt-12 sm:mt-16 xl:u-mt-102">
        {members.map((member, i) => (
          <motion.div key={member.name + i} custom={i} variants={swipeCardVariants} className={cn(swipeCardSize, 'xl:u-w-489')}>
            <button
              type="button"
              onClick={() => setOpen(member)}
              aria-haspopup="dialog"
              className="group relative block h-[26rem] w-full cursor-pointer overflow-hidden rounded-[2rem] bg-brand-lilac text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-violet sm:h-[28rem] xl:u-h-634 xl:u-rounded-40"
            >
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
              <span className="absolute inset-x-4 bottom-4 flex min-h-24 flex-col justify-center rounded-[1.25rem] bg-white/75 px-5 py-4 pr-16 backdrop-blur-md transition-colors duration-300 group-hover:bg-white/90 xl:u-bottom-33 xl:u-left-30 xl:u-right-30 xl:u-h-108 xl:u-rounded-25 xl:u-pl-27 xl:u-pr-30 xl:u-py-0">
                <span className="text-lg font-bold leading-snug text-brand-purple xl:u-text-30 xl:u-leading-35">
                  Meet {member.name}, {shortRole(member.role)}
                </span>
                <LongArrow className="absolute bottom-5 right-5 w-12 text-brand-purple transition-transform duration-300 ease-out group-hover:translate-x-1.5 xl:u-bottom-22 xl:u-right-22 xl:u-w-54" />
              </span>
            </button>
          </motion.div>
        ))}
      </SwipeRow>
      <MemberDialog member={open} onClose={() => setOpen(null)} />
    </>
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
