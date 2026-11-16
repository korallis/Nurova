import type { Metadata } from 'next';
import Link from 'next/link';
import { count, desc, isNull } from 'drizzle-orm';
import { ChevronRight, Mail } from 'lucide-react';
import { db, schema } from '@/lib/db';
import { requireAccess } from '@/lib/auth/dal';
import { FORM_KINDS, INBOXES } from '@/lib/forms/shared';

export const metadata: Metadata = { title: 'Inbox' };

export default async function InboxHome() {
  await requireAccess('inbox');
  const [byForm, subscribers, recent] = await Promise.all([
    db()
      .select({ form: schema.formSubmissions.form, status: schema.formSubmissions.status, unread: isNull(schema.formSubmissions.readAt), n: count() })
      .from(schema.formSubmissions)
      .groupBy(schema.formSubmissions.form, schema.formSubmissions.status, isNull(schema.formSubmissions.readAt)),
    db().select({ n: count() }).from(schema.newsletterSubscribers),
    db()
      .select({ id: schema.formSubmissions.id, form: schema.formSubmissions.form, name: schema.formSubmissions.name, subject: schema.formSubmissions.subject, createdAt: schema.formSubmissions.createdAt })
      .from(schema.formSubmissions)
      .where(isNull(schema.formSubmissions.readAt))
      .orderBy(desc(schema.formSubmissions.createdAt))
      .limit(8),
  ]);

  const tally = (form: string, pick: (row: (typeof byForm)[number]) => boolean) =>
    byForm.filter((r) => r.form === form && pick(r)).reduce((sum, r) => sum + r.n, 0);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold sm:text-3xl">Inbox</h1>
        <p className="mt-1 text-sm text-neutral-500">Everything sent through the website’s forms, each in its own inbox.</p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {FORM_KINDS.map((form) => {
          const unread = tally(form, (r) => Boolean(r.unread));
          const open = tally(form, (r) => r.status === 'open');
          return (
            <Link key={form} href={`/admin/inbox/${form}`} className="group rounded-xl border border-neutral-200 bg-white p-5 transition hover:border-brand-coral hover:shadow-md">
              <div className="flex items-start justify-between gap-3">
                <Mail className="h-6 w-6 text-brand-coral" aria-hidden="true" />
                {unread > 0 && <span className="rounded-full bg-brand-coral px-2 py-0.5 text-xs font-bold text-white">{unread} unread</span>}
              </div>
              <p className="mt-3 font-bold">{INBOXES[form].label}</p>
              <p className="text-sm text-neutral-500">{INBOXES[form].description}</p>
              <p className="mt-2 text-xs font-semibold text-neutral-600">
                {open} open · {tally(form, () => true)} in total
              </p>
            </Link>
          );
        })}
        <Link href="/admin/inbox/newsletter" className="rounded-xl border border-neutral-200 bg-white p-5 transition hover:border-brand-coral hover:shadow-md">
          <Mail className="h-6 w-6 text-brand-coral" aria-hidden="true" />
          <p className="mt-3 font-bold">Newsletter</p>
          <p className="text-sm text-neutral-500">Email sign-ups from the website.</p>
          <p className="mt-2 text-xs font-semibold text-neutral-600">{subscribers[0].n} subscribers</p>
        </Link>
      </div>

      <section>
        <h2 className="text-sm font-bold uppercase tracking-wide text-neutral-500">Unread</h2>
        {recent.length === 0 ? (
          <p className="mt-2 rounded-xl border border-dashed border-neutral-300 bg-white p-6 text-center text-sm text-neutral-500">You’re all caught up.</p>
        ) : (
          <ul className="mt-2 divide-y divide-neutral-200 rounded-xl border border-neutral-200 bg-white">
            {recent.map((m) => (
              <li key={m.id}>
                <Link href={`/admin/inbox/${m.form}/${m.id}`} className="flex items-center gap-4 px-4 py-3 hover:bg-neutral-50">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-brand-coral" aria-label="Unread" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-bold">{m.subject}</span>
                    <span className="block truncate text-xs text-neutral-500">
                      {INBOXES[m.form].label} · {m.name}
                    </span>
                  </span>
                  <span className="hidden text-xs text-neutral-500 sm:block">{m.createdAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                  <ChevronRight className="h-4 w-4 text-neutral-400" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
