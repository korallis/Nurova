'use client';

import { motion } from 'motion/react';
import { Reveal } from '@/components/motion/Reveal';
import { MultiLine } from '@/components/common/MultiLine';
import { ButtonLink } from '@/components/ui/button';
import { ROUTES } from '@/constants';
import type { HomeContent } from '@/lib/content/pages';
import { cn } from '@/lib/utils';
import { BrushUnderline } from './Decorations';
import { bodyText, container, sectionHeading } from './homeStyles';

/** "Understanding is more than a diagnosis": the quote slides in from the left, the divider grows, the text slides in from the right. */
export function QuoteSection({ content }: { content: HomeContent['quote'] }) {
  return (
    <section
      className={cn(
        container,
        'mt-16 grid items-start gap-10 sm:mt-20 md:grid-cols-[1fr_auto_1fr] md:gap-12 xl:u-mt-87 xl:grid-cols-[calc(var(--u)*731)_auto_1fr] xl:gap-0'
      )}
    >
      <Reveal from="left" className="relative text-center xl:u-mt-6">
        <blockquote>
          <p className={cn(sectionHeading, 'text-brand-purple')}>
            <MultiLine text={content.text} />
          </p>
        </blockquote>
        <BrushUnderline className="relative mx-auto -mt-1 block w-[min(100%,20rem)] sm:w-[min(100%,26rem)] xl:u-mt-4 xl:u-w-490" />
      </Reveal>

      <motion.div
        aria-hidden="true"
        className="hidden w-[3px] origin-top self-stretch rounded-full bg-brand-purple md:block xl:u-mt-24 xl:u-h-216 xl:self-start"
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      />

      <Reveal from="right" delay={0.15} className="text-center md:text-left xl:u-mt-24 xl:u-pl-79">
        <p className={cn(bodyText, 'text-brand-purple xl:u-max-w-780')}>{content.body}</p>
        <ButtonLink href={ROUTES.book} className="mt-6 xl:u-mt-50">
          {content.cta}
        </ButtonLink>
      </Reveal>
    </section>
  );
}
