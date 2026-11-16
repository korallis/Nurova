import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { and, count, desc, eq, isNull, type SQL } from 'drizzle-orm';
import { ArrowLeft, Download } from 'lucide-react';
import { db, schema } from '@/lib/db';
import { requireAccess } from '@/lib/auth/dal';
import { INBOXES, SUBMISSION_STATUS_LABELS } from '@/lib/forms/shared';
import type { FormKind, SubmissionStatus } from '@/lib/db/schema';
import { cn } from '@/lib/utils';

export const metadata: Metadata = { title: 'Inbox' };

const FILTERS = { unread: 'Unread', open: 'Open', resolved: 'Resolved', archived: 'Archived', all: 'All' } as const;
type Filter = keyof typeof FILTERS;

const pill = (active: boolean) =>
  cn('rounded-full border px-3 py-1 text-xs font-bold transition', active ? 'border-brand-ink bg-brand-ink text-white' : 'border-neutral-300 bg-white hover:border-brand-ink');

export default async function FormInbox({ params, searchParams }: PageProps<'/admin/inbox/[form]'>) {
  await requireAccess('inbox');
  const { form: formParam } = await params;
  if (!Object.hasOwn(INBOXES, formParam)) notFound();
  const form = formParam as FormKind;
  const query = await searchParams;
  // Open messages by default: new ones, and ones still being dealt with.
  const filter: Filter = typeof query.show === 'string' && Object.hasOwn(FILTERS, query.show) ? (query.show as Filter) : 'open';

  const where: SQL[] = [eq(schema.formSubmissions.form, form)];
  if (filter === 'unread') where.push(isNull(schema.formSubmissions.readAt));
  else if (filter !== 'all') where.push(eq(schema.formSubmissions.status, filter as SubmissionStatus));

  const [messages, [unread]] = await Promise.all([
    db()
      .select({
        id: schema.formSubmissions.id,
        name: schema.formSubmissions.name,
        email: schema.formSubmissions.email,
        subject: schema.formSubmissions.subject,
        status: schema.formSubmissions.status,
        readAt: schema.formSubmissions.readAt,
        createdAt: schema.formSubmissions.createdAt,
      })
      .from(schema.formSubmissions)
      .where(and(...where))
      .orderBy(desc(schema.formSubmissions.createdAt))
      .limit(500),
    db().select({ n: count() }).from(schema.formSubmissions).where(and(eq(schema.formSubmissions.form, form), isNull(schema.formSubmissions.readAt))),
  ]);

  const inbox = INBOXES[form];

  return (
    <div className="space-y-6">
      <Link href="/admin/inbox" className="inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-500 hover:text-brand-ink">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> All inboxes
      </Link>

      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">{inbox.label}</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {inbox.description} From{' '}
            <a href={inbox.path} target="_blank" rel="noreferrer" className="underline">
              {inbox.path}
            </a>
            .
          </p>
        </div>
        <a
          href={`/api/admin/inbox/${form}/export`}
          className="inline-flex items-center gap-1.5 rounded-full border border-neutral-300 bg-white px-4 py-1.5 text-xs font-bold hover:border-brand-ink"
        >
          <Download className="h-3.5 w-3.5" aria-hidden="true" /> Export all (CSV)
        </a>
      </header>

      <nav aria-label="Filter messages" className="flex flex-wrap gap-2">
        {(Object.keys(FILTERS) as Filter[]).map((f) => (
          <Link key={f} href={`/admin/inbox/${form}?show=${f}`} className={pill(filter === f)} aria-current={filter === f ? 'page' : undefined}>
            {FILTERS[f]}
            {f === 'unread' && unread.n > 0 && ` (${unread.n})`}
          </Link>
        ))}
      </nav>

      {messages.length === 0 ? (
        <p className="rounded-xl border border-dashed border-neutral-300 bg-white p-8 text-center text-sm text-neutral-500">
          {filter === 'all' ? 'Nothing here yet. Messages from the form will appear here.' : `No ${FILTERS[filter].toLowerCase()} messages.`}
        </p>
      ) : (
        <ul className="divide-y divide-neutral-200 rounded-xl border border-neutral-200 bg-white">
          {messages.map((m) => {
            const isUnread = !m.readAt;
            return (
              <li key={m.id}>
                <Link href={`/admin/inbox/${form}/${m.id}`} className="flex items-center gap-4 px-4 py-3 hover:bg-neutral-50">
                  <span className={cn('h-2 w-2 shrink-0 rounded-full', isUnread ? 'bg-brand-coral' : 'bg-transparent')} aria-label={isUnread ? 'Unread' : undefined} />
                  <span className="min-w-0 flex-1">
                    <span className={cn('block truncate', isUnread ? 'font-bold' : 'font-medium')}>{m.subject}</span>
                    <span className="block truncate text-xs text-neutral-500">
                      {m.name} · {m.email}
                    </span>
                  </span>
                  {m.status !== 'open' && (
                    <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-bold', m.status === 'resolved' ? 'bg-brand-violet/15 text-brand-ink' : 'bg-neutral-100 text-neutral-600')}>
                      {SUBMISSION_STATUS_LABELS[m.status]}
                    </span>
                  )}
                  <span className="hidden w-28 text-right text-xs text-neutral-500 sm:block">
                    {m.createdAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
