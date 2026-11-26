'use client';

import { useEffect, useRef, useState } from 'react';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { FaqAccordion } from '@/components/common/FaqAccordion';
import { PageLabel } from '@/components/about/PageLabel';
import { pageHeading } from '@/components/about/aboutStyles';
import { STROKE_COLOURS } from '@/components/assessments/AssessmentPage';
import { ClosingCta } from '@/components/home/ClosingCta';
import { container } from '@/components/home/homeStyles';
import type { FaqPageContent } from '@/lib/content/faqs';
import { slugify } from '@/lib/slug';
import { cn } from '@/lib/utils';

const ALL = '__all__';

/**
 * The FAQs: category buttons, then the questions in that category in a
 * scrolling list with a pink and coral scrollbar (from `lg` up; on smaller
 * screens the list just runs down the page). The chosen category is kept in
 * the address (`?category=right-to-choose`) so it can be linked to.
 */
export function FaqsPage({ content }: { content: FaqPageContent }) {
  const [category, setCategory] = useState(ALL);
  const listRef = useRef<HTMLDivElement>(null);

  // Open on the category named in the address, if there is one.
  useEffect(() => {
    const wanted = new URLSearchParams(window.location.search).get('category');
    const match = wanted && content.categories.find((c) => slugify(c) === wanted);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reads the address once, after hydration
    if (match) setCategory(match);
  }, [content.categories]);

  const choose = (next: string) => {
    setCategory(next);
    listRef.current?.scrollTo({ top: 0 });
    const url = new URL(window.location.href);
    if (next === ALL) url.searchParams.delete('category');
    else url.searchParams.set('category', slugify(next));
    window.history.replaceState(null, '', url);
  };

  const items = category === ALL ? content.items : content.items.filter((item) => item.categories.includes(category));
  const buttons = [...content.categories.map((name) => ({ value: name, label: name })), { value: ALL, label: content.allLabel }];

  return (
    <div className="flex w-full flex-col overflow-x-clip">
      <section aria-labelledby="faqs-heading" className={cn(container, 'mt-4 xl:u-mt-124')}>
        <PageLabel>{content.label}</PageLabel>
        <div className="xl:u-pl-100">
          <Reveal onLoad from="up" delay={0.15}>
            <h1 id="faqs-heading" className={cn(pageHeading, 'mt-6 text-brand-coral xl:u-mt-17')}>
              {content.title}
            </h1>
          </Reveal>

          <div role="group" aria-label="Question categories" className="mt-6 xl:u-mt-38">
            <Stagger onLoad delay={0.3} stagger={0.03} className="flex flex-wrap gap-2 xl:u-gap-x-16 xl:u-gap-y-11">
              {buttons.map((b) => {
                const active = b.value === category;
                return (
                  <StaggerItem key={b.value} from="pop">
                    <button
                      type="button"
                      onClick={() => choose(b.value)}
                      aria-pressed={active}
                      aria-controls="faqs-list"
                      className={cn(
                        'inline-flex h-10 cursor-pointer items-center rounded-full px-4 text-sm font-bold text-white transition duration-200 hover:-translate-y-0.5',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                        'xl:u-h-50 xl:u-px-18 xl:u-text-20',
                        active ? 'bg-brand-coral focus-visible:ring-brand-coral' : 'bg-brand-purple hover:bg-brand-violet focus-visible:ring-brand-purple'
                      )}
                    >
                      {b.label}
                    </button>
                  </StaggerItem>
                );
              })}
            </Stagger>
          </div>

          <Reveal onLoad from="up" delay={0.5} className="mt-5 xl:u-mt-22">
            <div ref={listRef} id="faqs-list" aria-live="polite" className="faq-scrollbar lg:max-h-[36rem] lg:overflow-y-auto lg:pr-6 xl:max-h-none xl:u-h-544 xl:u-w-1578 xl:u-pr-40">
              {items.length > 0 ? (
                <FaqAccordion key={category} items={items} bar="bg-brand-coral text-white" answer="bg-[#ffd4eb] text-black" />
              ) : (
                <p className="rounded-[1.75rem] bg-[#ffd4eb] px-5 py-6 text-base text-brand-purple xl:u-rounded-36 xl:u-px-35 xl:u-py-30 xl:u-text-24">{content.emptyText}</p>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      <ClosingCta content={content.closing} variant="condition" colors={[STROKE_COLOURS[content.closing.strokeLeft], STROKE_COLOURS[content.closing.strokeRight]]} />
    </div>
  );
}
