import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { and, eq, isNull } from 'drizzle-orm';
import { ArrowLeft, Mail, Phone } from 'lucide-react';
import { db, schema } from '@/lib/db';
import { requireAccess } from '@/lib/auth/dal';
import { ConfirmButton } from '@/components/admin/ConfirmButton';
import { RefreshOnMount } from '@/components/admin/RefreshOnMount';
import { SubmissionStatusForm } from '@/components/admin/SubmissionStatusForm';
import { deleteSubmission, markUnread } from '@/lib/admin/inbox-actions';
import { INBOXES } from '@/lib/forms/shared';
import type { FormKind } from '@/lib/db/schema';

export const metadata: Metadata = { title: 'Message' };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function MessagePage({ params }: PageProps<'/admin/inbox/[form]/[id]'>) {
  await requireAccess('inbox');
  const { form: formParam, id } = await params;
  if (!Object.hasOwn(INBOXES, formParam) || !UUID.test(id)) notFound();
  const form = formParam as FormKind;

  const [message] = await db()
    .select()
    .from(schema.formSubmissions)
    .where(and(eq(schema.formSubmissions.id, id), eq(schema.formSubmissions.form, form)));
  if (!message) notFound();

  // Opening a message marks it read (once).
  const justRead = !message.readAt;
  if (justRead) {
    await db()
      .update(schema.formSubmissions)
      .set({ readAt: new Date() })
      .where(and(eq(schema.formSubmissions.id, id), isNull(schema.formSubmissions.readAt)));
  }

  const replySubject = encodeURIComponent(`Re: ${message.subject} (${message.reference})`);

  return (
    <div className="space-y-6">
      {/* The menu was rendered before this message was marked read; update its badge. */}
      <RefreshOnMount when={justRead} />
      <Link href={`/admin/inbox/${form}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-500 hover:text-brand-ink">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> {INBOXES[form].label}
      </Link>

      <header>
        <h1 className="text-2xl font-bold sm:text-3xl">{message.subject}</h1>
        <p className="mt-1 text-sm text-neutral-500">
          From {message.name} · {message.createdAt.toLocaleString('en-GB', { dateStyle: 'long', timeStyle: 'short' })} · ref {message.reference}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href={`mailto:${message.email}?subject=${replySubject}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-brand-ink px-4 py-1.5 text-xs font-bold text-white hover:bg-brand-ink/90"
          >
            <Mail className="h-3.5 w-3.5" aria-hidden="true" /> Reply to {message.email}
          </a>
          {message.phone && (
            <a href={`tel:${message.phone.replace(/\s/g, '')}`} className="inline-flex items-center gap-1.5 rounded-full border border-neutral-300 px-4 py-1.5 text-xs font-bold hover:border-brand-ink">
              <Phone className="h-3.5 w-3.5" aria-hidden="true" /> {message.phone}
            </a>
          )}
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_18rem]">
        <div className="space-y-4">
          {message.answers.map((section) => (
            <section key={section.title} className="rounded-xl border border-neutral-200 bg-white p-4">
              <h2 className="text-xs font-bold uppercase tracking-wide text-neutral-500">{section.title}</h2>
              <dl className="mt-3 space-y-3 text-sm">
                {section.fields.map((field) => (
                  <div key={field.label} className="grid gap-1 sm:grid-cols-[14rem_1fr] sm:gap-4">
                    <dt className="font-semibold text-neutral-600">{field.label}</dt>
                    <dd className="whitespace-pre-line break-words">{field.value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>

        <aside className="space-y-4">
          <SubmissionStatusForm id={message.id} status={message.status} notes={message.notes} />
          <div className="flex flex-wrap gap-2">
            <form action={markUnread.bind(null, message.id, form)}>
              <button type="submit" className="cursor-pointer rounded-full border border-neutral-300 bg-white px-4 py-1.5 text-xs font-bold hover:border-brand-ink">
                Mark as unread
              </button>
            </form>
            <ConfirmButton action={deleteSubmission.bind(null, message.id, form)} confirm="Delete this message for good? This can’t be undone." danger>
              Delete
            </ConfirmButton>
          </div>
        </aside>
      </div>
    </div>
  );
}
