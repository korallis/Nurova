import Image from 'next/image';
import Link from 'next/link';
import { requireAdmin } from '@/lib/auth/dal';
import { AREA_KEYS, canAccess, isSuperAdmin } from '@/lib/auth/permissions';
import { AdminNav } from '@/components/admin/AdminNav';

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  const areas = AREA_KEYS.filter((area) => canAccess(admin, area));

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="shrink-0 bg-brand-ink md:sticky md:top-0 md:flex md:h-screen md:w-60 md:flex-col">
        <Link href="/admin" className="block px-5 pt-5" aria-label="Dashboard home">
          <Image src="/logo-wordmark.svg" width={504} height={165} alt="Nurova" className="h-auto w-28 brightness-0 invert" />
        </Link>
        <AdminNav name={admin.name} areas={areas} superAdmin={isSuperAdmin(admin)} />
      </aside>
      <main className="min-w-0 flex-1 px-4 py-6 sm:px-8 sm:py-8">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
