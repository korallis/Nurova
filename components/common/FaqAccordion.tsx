'use client';

import { useId, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * Questions as full-width pill bars; pressing one opens its answer in a panel
 * that starts behind the bar, so the bar's rounded ends sit on it (as in the
 * designs). The first question starts open. Remount with a new `key` to reset.
 */
export function FaqAccordion({ items, bar, answer, className }: { items: FaqItem[]; bar: string; answer: string; className?: string }) {
  const [open, setOpen] = useState<number | null>(0);
  const id = useId();

  return (
    <div className={cn('space-y-3 xl:space-y-0 xl:[&>*+*]:u-mt-13', className)}>
      {items.map((item, i) => {
        const isOpen = open === i;
        const panelId = `${id}-answer-${i}`;
        return (
          <div key={i}>
            <h3>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className={cn(
                  bar,
                  'relative z-10 flex min-h-14 w-full cursor-pointer items-center justify-between gap-4 rounded-full px-5 py-3 text-left text-base font-semibold transition hover:brightness-105',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
                  'sm:text-lg xl:u-min-h-73 xl:u-px-35 xl:u-text-30 xl:u-leading-36'
                )}
              >
                {item.question}
                {isOpen ? <Minus className="h-4 w-4 shrink-0" strokeWidth={3.5} aria-hidden="true" /> : <Plus className="h-4 w-4 shrink-0" strokeWidth={3.5} aria-hidden="true" />}
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="-mt-14 overflow-hidden xl:-u-mt-73"
                >
                  <p
                    className={cn(
                      answer,
                      'whitespace-pre-line rounded-[1.75rem] px-5 pb-5 pt-[4.5rem] text-sm leading-relaxed sm:text-base xl:u-rounded-36 xl:u-px-35 xl:u-pb-36 xl:u-pt-94 xl:u-text-24 xl:u-leading-35'
                    )}
                  >
                    {item.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
