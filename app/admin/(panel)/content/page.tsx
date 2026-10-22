import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { db, schema } from '@/lib/db';
import { requireAccess } from '@/lib/auth/dal';
import { SINGLES, type SingleKey } from '@/lib/content/registry';

export const metadata: Metadata = { title: 'Website content' };

export default async function ContentIndex() {
  await requireAccess('content');
  const rows = await db().select({ key: schema.content.key, updatedAt: schema.content.updatedAt }).from(schema.content);
  const saved = new Map(rows.map((r) => [r.key, r]));

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-2xl font-bold sm:text-3xl">Website content</h1>
        <p className="mt-1 text-sm text-neutral-500">Choose a page to edit. Anything you haven’t edited yet shows the site’s original copy.</p>
      </header>

      <section>
        <h2 className="text-sm font-bold uppercase tracking-wide text-neutral-500">Pages</h2>
        <ul className="mt-2 divide-y divide-neutral-200 rounded-xl border border-neutral-200 bg-white">
          {(Object.keys(SINGLES) as SingleKey[]).map((key) => (
            <li key={key}>
              <Link href={`/admin/content/${key}`} className="flex items-center gap-4 px-4 py-3 hover:bg-neutral-50">
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">{SINGLES[key].label}</span>
                  <span className="block text-xs text-neutral-500">{SINGLES[key].description}</span>
                </span>
                <span className="hidden text-xs text-neutral-500 sm:block">
                  {saved.get(key) ? `Edited ${saved.get(key)!.updatedAt.toLocaleDateString('en-GB')}` : 'Original copy'}
                </span>
                <ChevronRight className="h-4 w-4 text-neutral-400" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
