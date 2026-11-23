'use client';

import Image from 'next/image';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { MultiLine } from '@/components/common/MultiLine';
import { ButtonLink } from '@/components/ui/button';
import { ClosingCta } from '@/components/home/ClosingCta';
import { Swirl } from '@/components/home/Decorations';
import { container, gradient } from '@/components/home/homeStyles';
import { ROUTES } from '@/constants';
import type { QualityContent } from '@/lib/content/pages';
import { cn } from '@/lib/utils';
import { pageHeading, pageText } from './aboutStyles';
import { PageLabel } from './PageLabel';

/** "Clinical excellence you can trust.": a frosted panel over the photo, which fills the card. */
function QualityHero({ content }: { content: QualityContent['hero'] }) {
  const { image } = content;
  return (
    <section aria-labelledby="quality-heading" className={cn(container, 'mt-4 xl:u-mt-124')}>
      <PageLabel>{content.label}</PageLabel>
      <Reveal onLoad from="zoom" delay={0.1} className="mt-5 xl:u-mt-37">
        <div className="relative isolate flex min-h-[30rem] items-center overflow-hidden rounded-[2rem] px-4 py-10 sm:px-8 xl:block xl:u-h-762 xl:p-0 xl:u-rounded-50">
          {image?.src ? (
            <Image src={image.src} alt={image.alt} fill priority sizes="(min-width: 1280px) 90vw, 100vw" className="-z-20 object-cover" />
          ) : (
            <div aria-hidden="true" className={cn('absolute inset-0 -z-20', gradient)} />
          )}
          <Swirl delay={0.9} opacity={0.45} className="-z-10 left-[-10%] top-[-25%] w-[80%] xl:-u-left-120 xl:-u-top-180 xl:u-w-1100" />

          <Stagger
            onLoad
            delay={0.4}
            stagger={0.15}
            className="w-full rounded-[1.75rem] bg-white/75 px-6 py-8 text-center text-brand-purple shadow-[0_10px_40px_rgba(40,0,80,0.12)] backdrop-blur-md sm:px-10 xl:absolute xl:w-auto xl:u-left-100 xl:u-right-100 xl:u-top-212 xl:u-rounded-40 xl:u-px-60 xl:u-pt-45 xl:u-pb-47"
          >
            <StaggerItem>
              <h1 id="quality-heading" className="text-[2.2rem] font-bold leading-[1.1] sm:text-5xl xl:u-text-90 xl:u-leading-100">
                <MultiLine text={content.title} />
              </h1>
            </StaggerItem>
            <StaggerItem>
              <p className={cn(pageText, 'mx-auto mt-4 max-w-2xl xl:u-mt-20 xl:max-w-none')}>{content.body}</p>
            </StaggerItem>
            <StaggerItem className="mt-7 flex flex-wrap justify-center gap-3 xl:u-mt-35 xl:u-gap-24">
              <ButtonLink href={ROUTES.policies} variant="purple" className="xl:u-min-w-226">
                {content.primaryCta}
              </ButtonLink>
              <ButtonLink href={ROUTES.contact} variant="outlinePurple">
                {content.secondaryCta}
              </ButtonLink>
            </StaggerItem>
          </Stagger>
        </div>
      </Reveal>
    </section>
  );
}

/** "Clinical governance & quality assurance": text on the left with a lilac swirl behind it, the photo on the right. */
function Governance({ content }: { content: QualityContent['governance'] }) {
  const { image } = content;
  return (
    <section aria-labelledby="governance-heading" className={cn(container, 'relative isolate mt-16 grid items-start gap-10 sm:mt-20 lg:grid-cols-2 xl:u-mt-105 xl:grid-cols-[1fr_calc(var(--u)*748)] xl:gap-0')}>
      <Swirl delay={0.3} opacity={1} color="#f3e6fb" strokeWidth={34} className="-z-10 hidden -scale-x-100 lg:block lg:left-[20%] lg:top-[-6%] lg:w-[60%] xl:u-left-430 xl:-u-top-80 xl:u-w-800" />

      <Stagger stagger={0.14} className="relative lg:py-8 xl:u-pl-100 xl:u-pr-40 xl:u-pt-63 xl:u-pb-0">
        <StaggerItem>
          <h2 id="governance-heading" className={cn(pageHeading, 'text-brand-coral')}>
            <MultiLine text={content.title} />
          </h2>
        </StaggerItem>
        <StaggerItem>
          <p className={cn(pageText, 'mt-5 text-brand-purple xl:u-mt-22 xl:u-max-w-840')}>{content.body}</p>
        </StaggerItem>
        <StaggerItem from="pop" className="mt-8 xl:u-mt-61">
          <ButtonLink href={ROUTES.contact}>{content.cta}</ButtonLink>
        </StaggerItem>
      </Stagger>

      <Reveal from="right" className="relative isolate min-h-72 overflow-hidden rounded-[2rem] sm:min-h-96 xl:u-h-643 xl:u-rounded-50">
        {image?.src ? (
          <Image src={image.src} alt={image.alt} fill sizes="(min-width: 1280px) 40vw, (min-width: 1024px) 50vw, 100vw" className="object-cover transition-transform duration-[1.2s] ease-out hover:scale-[1.03]" />
        ) : (
          <div aria-hidden="true" className={cn('absolute inset-0 rotate-180', gradient)}>
            <Swirl delay={0.4} strokeWidth={22} className="left-0 top-0 w-full" />
          </div>
        )}
      </Reveal>
    </section>
  );
}

/** Quality & clinical standards; `content` is edited in the dashboard (Website content → About › Quality & clinical standards). */
export function QualitySections({ content }: { content: QualityContent }) {
  return (
    <div className="flex w-full flex-col overflow-x-clip">
      <QualityHero content={content.hero} />
      <Governance content={content.governance} />
      <ClosingCta content={content.closing} variant="quality" />
    </div>
  );
}
