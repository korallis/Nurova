'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { GradientHero } from '@/components/common/GradientHero';
import { LongArrow } from '@/components/common/LongArrow';
import { MultiLine } from '@/components/common/MultiLine';
import { STROKE_COLOURS } from '@/components/assessments/AssessmentPage';
import { ButtonLink } from '@/components/ui/button';
import { ClosingCta } from '@/components/home/ClosingCta';
import { container, sectionHeading } from '@/components/home/homeStyles';
import { ROUTES } from '@/constants';
import type { SupportContent, SupportService } from '@/lib/content/support';
import { cn } from '@/lib/utils';

const SERVICES_ID = 'support-services';

/** "Different minds. Different needs.": centred heading, text and a button. */
function Intro({ intro }: { intro: SupportContent['intro'] }) {
  return (
    <section aria-labelledby="support-intro-heading" className={cn(container, 'mt-16 text-center text-brand-violet sm:mt-20 xl:u-mt-100')}>
      <Stagger stagger={0.14}>
        <StaggerItem>
          <h2 id="support-intro-heading" className={sectionHeading}>
            <MultiLine text={intro.title} />
          </h2>
        </StaggerItem>
        <StaggerItem>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed sm:text-lg sm:leading-relaxed xl:u-mt-22 xl:max-w-none xl:u-text-25 xl:u-leading-45">
            <MultiLine text={intro.body} />
          </p>
        </StaggerItem>
        <StaggerItem from="pop" className="mt-8 xl:u-mt-27">
          <ButtonLink href={ROUTES.ourApproach} variant="violet" className="xl:u-min-w-228">
            {intro.cta}
          </ButtonLink>
        </StaggerItem>
      </Stagger>
    </section>
  );
}

/** One service: text on the left, the photo filling the right; on smaller screens the photo goes on top. */
function ServiceCard({ service, cta, active }: { service: SupportService; cta: string; active: boolean }) {
  return (
    <article
      aria-roledescription="slide"
      aria-label={service.title}
      aria-hidden={!active}
      className="flex w-full shrink-0 snap-start flex-col overflow-hidden rounded-[2rem] bg-brand-purple text-white lg:flex-row xl:u-h-580 xl:u-rounded-50"
    >
      <div className="flex flex-1 flex-col px-7 pb-8 pt-8 sm:px-12 sm:pb-10 lg:w-[61%] lg:shrink-0 xl:u-w-931 xl:u-pl-96 xl:u-pr-50 xl:u-pt-65 xl:u-pb-56">
        <h3 className="text-3xl font-bold leading-tight sm:text-4xl xl:u-text-55 xl:u-leading-60">{service.title}</h3>
        <p className="mt-3 text-lg font-semibold leading-snug sm:text-xl xl:u-mt-25 xl:u-text-30 xl:u-leading-36">{service.subtitle}</p>
        <p className="mt-4 text-base leading-relaxed xl:u-mt-26 xl:u-text-25 xl:u-leading-35">{service.body}</p>
        <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between xl:mt-auto">
          <ul className="space-y-1 text-base leading-relaxed xl:space-y-0 xl:u-pl-14 xl:u-text-25 xl:u-leading-35">
            {service.points.map((point, i) => (
              <li key={i} className="flex gap-3 xl:u-gap-12">
                <span aria-hidden="true">•</span>
                {point}
              </li>
            ))}
          </ul>
          <Link
            href={service.href}
            tabIndex={active ? undefined : -1}
            className="group inline-flex shrink-0 items-center gap-4 self-end text-sm font-semibold focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white xl:u-gap-18 xl:u-text-20"
          >
            {cta}
            <span className="sr-only"> about {service.title}</span>
            <LongArrow className="w-12 transition-transform duration-300 ease-out group-hover:translate-x-1.5 xl:u-w-54" />
          </Link>
        </div>
      </div>
      {service.image?.src && (
        <div className="relative order-first h-56 shrink-0 sm:h-80 lg:order-none lg:h-auto lg:flex-1">
          <Image src={service.image.src} alt={service.image.alt} fill sizes="(min-width: 1024px) 32vw, 100vw" className="object-cover" />
        </div>
      )}
    </article>
  );
}

/**
 * The services, one card at a time. The buttons above and the dots below
 * show the current card and switch to another; on touch screens the cards
 * also swipe. The current button and dot are coral, the rest purple/violet.
 */
function Services({ services }: { services: SupportContent['services'] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const { items } = services;

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const cards = Array.from(track.children) as HTMLElement[];
    const start = cards[0]?.offsetLeft ?? 0;
    const nearest = cards.reduce(
      (best, card, i) => (Math.abs(card.offsetLeft - start - track.scrollLeft) < Math.abs(cards[best].offsetLeft - start - track.scrollLeft) ? i : best),
      0
    );
    setCurrent(nearest);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    track.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [measure]);

  const show = (i: number) => {
    const track = trackRef.current;
    const cards = Array.from(track?.children ?? []) as HTMLElement[];
    if (track && cards[i]) track.scrollTo({ left: cards[i].offsetLeft - cards[0].offsetLeft, behavior: 'smooth' });
    setCurrent(i);
  };

  return (
    <section id={SERVICES_ID} aria-roledescription="carousel" aria-label="Our support services" className="mt-14 scroll-mt-24 sm:mt-16 xl:u-mt-101">
      <Reveal from="up" className={cn(container, 'flex flex-wrap justify-center gap-2 sm:gap-3 xl:u-gap-48')}>
        {items.map((s, i) => (
          <button
            key={i}
            type="button"
            onClick={() => show(i)}
            aria-pressed={i === current}
            aria-controls={`${SERVICES_ID}-track`}
            className={cn(
              'inline-flex h-10 cursor-pointer items-center rounded-full px-4 text-sm font-bold text-white transition duration-200 hover:-translate-y-0.5',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 xl:u-h-50 xl:u-px-18 xl:u-text-20',
              i === current ? 'bg-brand-coral focus-visible:ring-brand-coral' : 'bg-brand-purple hover:bg-brand-violet focus-visible:ring-brand-purple'
            )}
          >
            {s.tab}
          </button>
        ))}
      </Reveal>

      <Reveal from="up" delay={0.1} className="mx-auto mt-6 w-[calc(100%-2.5rem)] sm:w-[calc(100%-4rem)] xl:u-mt-48 xl:u-w-1520">
        {/*
          `relative` makes the track the containing block for absolutely positioned
          descendants (e.g. the links' sr-only text). Without it they're positioned
          against an ancestor outside the scroller, escape its clipping, and the
          off-screen slides widen the whole page.
        */}
        <div id={`${SERVICES_ID}-track`} ref={trackRef} className="no-scrollbar relative flex snap-x snap-mandatory gap-6 overflow-x-auto overscroll-x-contain xl:u-gap-40">
          {items.map((service, i) => (
            <ServiceCard key={i} service={service} cta={services.cta} active={i === current} />
          ))}
        </div>
      </Reveal>

      {items.length > 1 && (
        <div className="mt-5 flex items-center justify-center gap-3 xl:u-mt-49 xl:u-gap-17">
          {items.map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => show(i)}
              aria-label={`Show ${s.title}`}
              aria-current={i === current || undefined}
              className={cn(
                'h-4 w-4 shrink-0 cursor-pointer rounded-full transition-all duration-300 hover:scale-125 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-violet focus-visible:ring-offset-2 xl:u-size-20',
                i === current ? 'bg-brand-coral' : 'bg-brand-violet'
              )}
            />
          ))}
        </div>
      )}
    </section>
  );
}

/** The Support page; `content` is edited in the dashboard (Website content → Support). */
export function SupportPage({ content }: { content: SupportContent }) {
  const { hero, closing } = content;
  return (
    <div className="flex w-full flex-col overflow-x-clip">
      <GradientHero
        id="support-heading"
        label={content.label}
        title={hero.title}
        body={hero.body}
        bodyWidth="xl:u-max-w-880"
        primary={{ label: hero.primaryCta, href: `#${SERVICES_ID}` }}
        secondary={{ label: hero.secondaryCta, href: ROUTES.contact }}
        image={hero.image}
        imageClassName="-mt-4 ml-auto h-72 [mask-image:linear-gradient(to_bottom,transparent,black_40%)] sm:h-96 xl:right-0 xl:top-0 xl:mt-0 xl:h-full xl:[mask-image:none]"
        cardClassName="xl:rounded-tr-none!"
        swirlClassName="xl:u-left-561 xl:-u-top-31 xl:u-w-893"
      />
      <Intro intro={content.intro} />
      <Services services={content.services} />
      <ClosingCta
        content={closing}
        variant="support"
        colors={[STROKE_COLOURS[closing.strokeLeft], STROKE_COLOURS[closing.strokeRight]]}
        primaryHref={ROUTES.assessments}
        paddingTop="xl:u-pt-89"
      />
    </div>
  );
}
