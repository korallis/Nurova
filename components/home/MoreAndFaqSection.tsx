'use client';

import { Reveal } from '@/components/motion/Reveal';
import { MultiLine } from '@/components/common/MultiLine';
import { ButtonLink } from '@/components/ui/button';
import { ROUTES } from '@/constants';
import type { HomeContent } from '@/lib/content/pages';
import { cn } from '@/lib/utils';
import { bodyText, container, sectionHeading } from './homeStyles';

const card = 'flex h-full flex-col items-center rounded-[2rem] px-7 py-10 text-center transition duration-300 ease-out hover:-translate-y-1 sm:px-12 sm:py-12 xl:u-min-h-559 xl:u-rounded-55 xl:u-px-60';

/** "More Than An Assessment" and "Frequently asked questions", sliding in from either side. */
export function MoreAndFaqSection({ more, faq }: { more: HomeContent['afterAssessment']; faq: HomeContent['faq'] }) {
  return (
    <section className={cn(container, 'mt-16 grid gap-6 sm:mt-20 md:grid-cols-2 xl:u-mt-101 xl:u-gap-34')}>
      <Reveal from="left">
        <div
          className={cn(
            card,
            'border-[10px] border-brand-purple bg-white text-brand-purple hover:shadow-[0_18px_40px_rgba(108,6,154,0.18)] xl:u-border-15 xl:u-pt-62 xl:u-pb-47'
          )}
        >
          <h2 className={sectionHeading}>
            <MultiLine text={more.title} />
          </h2>
          <p className={cn(bodyText, 'mt-5 max-w-xl xl:u-mt-26 xl:u-max-w-610')}>{more.body}</p>
          <ButtonLink href={ROUTES.book} variant="purple" className="mt-8 xl:mt-auto">
            {more.cta}
          </ButtonLink>
        </div>
      </Reveal>

      <Reveal from="right" delay={0.12}>
        <div className={cn(card, 'bg-brand-coral text-white hover:shadow-[0_18px_40px_rgba(247,86,88,0.35)] xl:u-pt-77 xl:u-pb-62')}>
          <h2 className={sectionHeading}>
            <MultiLine text={faq.title} />
          </h2>
          <p className={cn(bodyText, 'mt-5 max-w-xl xl:u-mt-26 xl:u-max-w-640')}>
            <MultiLine text={faq.body} />
          </p>
          <ButtonLink href={ROUTES.faqs} variant="whitePurple" className="mt-8 xl:mt-auto">
            {faq.cta}
          </ButtonLink>
        </div>
      </Reveal>
    </section>
  );
}
