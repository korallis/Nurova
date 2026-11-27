'use client';

import { GradientHero } from '@/components/common/GradientHero';
import { STROKE_COLOURS } from '@/components/assessments/AssessmentPage';
import { ClosingCta } from '@/components/home/ClosingCta';
import { ROUTES } from '@/constants';
import type { SupportContent } from '@/lib/content/support';
import type { SupportServicePageContent } from '@/lib/content/support-services';
import { ServicesCarousel } from './ServicesCarousel';

const SERVICES_ID = 'support-services';

/**
 * A support service page (Post-Diagnostic Support, ADHD Coaching, Therapy, ADHD
 * Medication Pathway, Parent Support): the violet hero with the person rising
 * above it, the services carousel opened on this service, and the closing call
 * to action. `content` is edited in the dashboard (Website content → Support ›
 * …); the carousel comes from the Support page.
 */
export function SupportServicePage({
  content,
  services,
  path,
  bodyWidth,
}: {
  content: SupportServicePageContent;
  services: SupportContent['services'];
  /** This page's address, to open the carousel on its own service. */
  path: string;
  /** The hero text's max width from `xl` up, measured from each design. */
  bodyWidth: string;
}) {
  const { hero, closing } = content;
  return (
    <div className="flex w-full flex-col overflow-x-clip">
      <GradientHero
        id="service-heading"
        label={content.label}
        title={hero.title}
        body={hero.body}
        bodyWidth={bodyWidth}
        primary={{ label: hero.primaryCta, href: `#${SERVICES_ID}` }}
        secondary={{ label: hero.secondaryCta, href: ROUTES.contact }}
        image={hero.image}
        tone="violet"
        photoRises
        imageClassName="ml-auto h-80 sm:h-[26rem] xl:bottom-0 xl:right-0 xl:u-h-901"
        swirlClassName="xl:u-left-563 xl:-u-top-25 xl:u-w-874"
      />
      <ServicesCarousel services={services} id={SERVICES_ID} title={content.servicesTitle} currentHref={path} className="mt-14 sm:mt-16 xl:u-mt-94" />
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
