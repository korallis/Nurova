import type { Metadata } from 'next';
import Link from 'next/link';
import { count } from 'drizzle-orm';
import { Mail } from 'lucide-react';
import { db, schema } from '@/lib/db';
import { requireAccess } from '@/lib/auth/dal';

export const metadata: Metadata = { title: 'Inbox' };

/** Everything sent through the website, one inbox per form. Add a card here for each new form. */
export default async function InboxHome() {
  await requireAccess('inbox');
  const [subscribers] = await db().select({ n: count() }).from(schema.newsletterSubscribers);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold sm:text-3xl">Inbox</h1>
        <p className="mt-1 text-sm text-neutral-500">Everything sent through the website’s forms, each in its own inbox.</p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/admin/inbox/newsletter" className="rounded-xl border border-neutral-200 bg-white p-5 transition hover:border-brand-coral hover:shadow-md">
          <Mail className="h-6 w-6 text-brand-coral" aria-hidden="true" />
          <p className="mt-3 font-bold">Newsletter</p>
          <p className="text-sm text-neutral-500">Email sign-ups from the coming-soon page.</p>
          <p className="mt-2 text-xs font-semibold text-neutral-600">{subscribers.n} subscribers</p>
        </Link>
      </div>
    </div>
  );
}
