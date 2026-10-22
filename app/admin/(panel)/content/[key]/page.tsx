import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { ArrowLeft } from 'lucide-react';
import { db, schema } from '@/lib/db';
import { requireAccess } from '@/lib/auth/dal';
import { contentArea } from '@/lib/auth/permissions';
import { withDefaults } from '@/lib/content/fields';
import { SINGLES, isSingleKey } from '@/lib/content/registry';
import { ContentEditor } from '@/components/admin/ContentEditor';
import { ConfirmButton } from '@/components/admin/ConfirmButton';
import { resetContent } from '@/lib/admin/content-actions';

export const metadata: Metadata = { title: 'Edit content' };

export default async function EditContentPage({ params }: PageProps<'/admin/content/[key]'>) {
  const { key } = await params;
  await requireAccess(contentArea(key));
  if (!isSingleKey(key)) notFound();

  const [row] = await db().select().from(schema.content).where(eq(schema.content.key, key));
  const def = SINGLES[key];

  return (
    <div className="space-y-6">
      <Link href="/admin/content" className="inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-500 hover:text-brand-ink">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> All content
      </Link>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">{def.label}</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {row ? `Last saved ${row.updatedAt.toLocaleString('en-GB')}` : 'Showing the site’s original copy — nothing saved yet.'}
          </p>
        </div>

        {row && (
          <ConfirmButton action={resetContent.bind(null, key)} confirm="Discard all saved changes to this page and go back to the original copy?">
            Reset to original
          </ConfirmButton>
        )}
      </header>

      <ContentEditor contentKey={key} schema={def.schema} initial={withDefaults(row?.data, def.defaults)} publicPath={def.path} />
    </div>
  );
}
