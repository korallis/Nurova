import type { Metadata } from 'next';
import Link from 'next/link';
import { desc } from 'drizzle-orm';
import { ArrowLeft, Download, Trash2 } from 'lucide-react';
import { db, schema } from '@/lib/db';
import { requireAccess } from '@/lib/auth/dal';
import { deleteSubscriber } from '@/lib/admin/inbox-actions';
import { newsletterSourceLabel } from '@/lib/forms/shared';

export const metadata: Metadata = { title: 'Newsletter' };

export default async function NewsletterInbox() {
  await requireAccess('inbox');
  const subscribers = await db().select().from(schema.newsletterSubscribers).orderBy(desc(schema.newsletterSubscribers.createdAt)).limit(5000);

  return (
    <div className="space-y-6">
      <Link href="/admin/inbox" className="inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-500 hover:text-brand-ink">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> All inboxes
      </Link>

      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Newsletter</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {subscribers.length} {subscribers.length === 1 ? 'person has' : 'people have'} signed up on the website. Export the list to import it into your email tool.
          </p>
        </div>
        {/* A file download (API route), so a plain link rather than <Link>. */}
        <a
          href="/api/admin/inbox/newsletter/export"
          className="inline-flex items-center gap-1.5 rounded-full border border-neutral-300 bg-white px-4 py-1.5 text-xs font-bold hover:border-brand-ink"
        >
          <Download className="h-3.5 w-3.5" aria-hidden="true" /> Export (CSV)
        </a>
      </header>

      {subscribers.length === 0 ? (
        <p className="rounded-xl border border-dashed border-neutral-300 bg-white p-8 text-center text-sm text-neutral-500">No sign-ups yet.</p>
      ) : (
        <ul className="divide-y divide-neutral-200 rounded-xl border border-neutral-200 bg-white">
          {subscribers.map((s) => (
            <li key={s.id} className="flex items-center gap-4 px-4 py-2.5 text-sm">
              <a href={`mailto:${s.email}`} className="min-w-0 flex-1 truncate font-semibold hover:underline">
                {s.email}
              </a>
              <span className="hidden text-xs text-neutral-500 sm:block">{newsletterSourceLabel(s.source)}</span>
              <span className="hidden w-24 text-right text-xs text-neutral-500 sm:block">{s.createdAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              <form action={deleteSubscriber.bind(null, s.id)}>
                <button type="submit" aria-label={`Remove ${s.email}`} className="cursor-pointer rounded-full p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-700">
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
