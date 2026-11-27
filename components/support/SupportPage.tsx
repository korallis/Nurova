'use client';

import { Stagger, StaggerItem } from '@/components/motion/Reveal';
import { GradientHero } from '@/components/common/GradientHero';
import { MultiLine } from '@/components/common/MultiLine';
import { STROKE_COLOURS } from '@/components/assessments/AssessmentPage';
import { ButtonLink } from '@/components/ui/button';
import { ClosingCta } from '@/components/home/ClosingCta';
import { container, sectionHeading } from '@/components/home/homeStyles';
import { ROUTES } from '@/constants';
import type { SupportContent } from '@/lib/content/support';
import { ServicesCarousel } from './ServicesCarousel';
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
      <ServicesCarousel services={content.services} id={SERVICES_ID} className="mt-14 sm:mt-16 xl:u-mt-101" />
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
