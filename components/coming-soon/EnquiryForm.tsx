'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, Loader2 } from 'lucide-react';
import { BotTrap, useFormSubmit } from '@/components/forms/BotTrap';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { submitEnquiry } from '@/lib/forms/submit';
import { ENQUIRER_TYPES, HELP_TOPICS, type EnquiryInput, type EnquirerType, type HelpTopic } from '@/lib/forms/shared';
import { cn } from '@/lib/utils';
import { coralButton } from './parts';

const panel = 'rounded-[20px] bg-white/15 p-[clamp(20px,1.75vw,34px)] transition-colors duration-300 hover:bg-white/[0.18] focus-within:bg-white/20';
const label = 'block text-[clamp(1rem,1.05vw,1.25rem)] font-bold';
const input =
  'mt-3 block h-[50px] w-full rounded-full bg-white px-6 text-[17px] text-[#333] shadow-[0_0_0_0_rgba(244,93,90,0)] transition-shadow duration-300 placeholder:font-medium placeholder:text-[#BDBDBD] focus:outline-none focus-visible:shadow-[0_0_0_4px_rgba(244,93,90,0.55)]';

/** A label followed by a white pill that fills coral, with a tick popping in, when chosen. */
function PillChoice({ type, name, value, children }: { type: 'radio' | 'checkbox'; name: string; value: string; children: React.ReactNode }) {
  return (
    <label className="group inline-flex cursor-pointer items-center gap-3 text-[clamp(0.95rem,1.05vw,1.25rem)]">
      <span>{children}</span>
      <input type={type} name={name} value={value} className="peer sr-only" />
      <span
        aria-hidden="true"
        className={cn(
          'flex h-[50px] w-[62px] shrink-0 items-center justify-center rounded-full bg-white text-white transition duration-300 ease-out',
          'group-hover:scale-105 group-active:scale-95 peer-checked:bg-brand-coral peer-checked:shadow-[0_6px_18px_rgba(244,93,90,0.45)]',
          '[&>svg]:scale-0 [&>svg]:-rotate-45 [&>svg]:transition-transform [&>svg]:duration-300 [&>svg]:ease-[cubic-bezier(0.34,1.56,0.64,1)] peer-checked:[&>svg]:scale-100 peer-checked:[&>svg]:rotate-0',
          'peer-focus-visible:ring-2 peer-focus-visible:ring-white peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-brand-purple'
        )}
      >
        <Check className="h-6 w-6" strokeWidth={3} />
      </span>
    </label>
  );
}

/** "Get in touch". Messages go to Inbox → Enquiries; `onSent` shows the confirmation. Each part reveals as it scrolls into view. */
export function EnquiryForm({ heading, submitLabel, onSent }: { heading: string; submitLabel: string; onSent: () => void }) {
  const { pending, error, reference, submit } = useFormSubmit();

  useEffect(() => {
    if (reference !== null) onSent();
  }, [reference, onSent]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const value = (name: string) => String(data.get(name) ?? '');
    const enquiry: EnquiryInput = {
      name: value('name'),
      email: value('email'),
      phone: value('phone'),
      organisation: value('organisation'),
      enquirer: value('enquirer') as EnquirerType | '',
      topics: data.getAll('topics').map(String) as HelpTopic[],
      somethingElse: value('somethingElse'),
      message: value('message'),
    };
    submit(form, (meta) => submitEnquiry(enquiry, meta));
  };

  return (
    <section id="get-in-touch" aria-labelledby="get-in-touch-heading" className="mx-auto w-full max-w-[1592px] scroll-mt-8 px-6">
      <Reveal from="left">
        <h2 id="get-in-touch-heading" className="px-[clamp(0px,2.4vw,46px)] text-[clamp(2.25rem,3.45vw,4.125rem)] font-bold leading-tight">
          {heading}
        </h2>
      </Reveal>

      <form onSubmit={handleSubmit} className="relative mt-[clamp(20px,1.9vw,36px)]">
        <Stagger stagger={0.12} className="space-y-5">
          <StaggerItem className={cn(panel, 'grid gap-x-7 gap-y-5 md:grid-cols-2')}>
            <label className={label}>
              Full name
              <input name="name" required autoComplete="name" maxLength={120} placeholder="Required*" className={input} />
            </label>
            <label className={label}>
              Email address
              <input name="email" type="email" required autoComplete="email" maxLength={254} placeholder="Required*" className={input} />
            </label>
            <label className={label}>
              Phone number
              <input name="phone" type="tel" autoComplete="tel" maxLength={40} placeholder="Optional" className={input} />
            </label>
            <label className={label}>
              Organisation name
              <input name="organisation" autoComplete="organization" maxLength={200} placeholder="For professional enquiries only" className={input} />
            </label>
          </StaggerItem>

          <StaggerItem>
            <fieldset className={panel}>
              <legend className={cn(label, 'float-left w-full')}>I’m enquiring…</legend>
              <div className="clear-both flex flex-wrap gap-x-8 gap-y-3 pt-4">
                {(Object.keys(ENQUIRER_TYPES) as EnquirerType[]).map((key) => (
                  <PillChoice key={key} type="radio" name="enquirer" value={key}>
                    {ENQUIRER_TYPES[key]}
                  </PillChoice>
                ))}
              </div>
            </fieldset>
          </StaggerItem>

          <StaggerItem>
            <fieldset className={panel}>
              <legend className={cn(label, 'float-left w-full')}>What can we help with?</legend>
              <div className="clear-both flex flex-wrap items-center gap-x-8 gap-y-3 pt-4">
                {(Object.keys(HELP_TOPICS) as HelpTopic[]).map((key) => (
                  <PillChoice key={key} type="checkbox" name="topics" value={key}>
                    {HELP_TOPICS[key]}
                  </PillChoice>
                ))}
                <label className="flex w-full flex-wrap items-center gap-3 text-[clamp(0.95rem,1.05vw,1.25rem)] sm:w-auto">
                  Something else
                  <input name="somethingElse" maxLength={300} className={cn(input, 'mt-0 w-full sm:w-[362px]')} />
                </label>
              </div>
            </fieldset>
          </StaggerItem>

          <StaggerItem className={panel}>
            <label className={label}>
              Your Message
              <textarea
                name="message"
                rows={1}
                maxLength={6000}
                placeholder="Optional. Please keep this brief and avoid including medical records or identifiable patient information."
                className={cn(input, 'field-sizing-content h-auto max-h-60 min-h-[50px] resize-none rounded-[25px] py-3 leading-[26px]')}
              />
            </label>
          </StaggerItem>

          <BotTrap />

          <AnimatePresence>
            {error && (
              <motion.p
                key={error}
                role="alert"
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -8, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden rounded-2xl bg-white px-5 py-3 text-base font-semibold text-brand-magenta"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <StaggerItem from="pop" className="w-fit">
            <button type="submit" disabled={pending} className={cn(coralButton, 'h-[50px] gap-2 text-[clamp(1.1rem,1.35vw,1.6rem)]')}>
              {pending && <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />}
              {pending ? 'Sending…' : submitLabel}
            </button>
          </StaggerItem>
        </Stagger>
      </form>
    </section>
  );
}
