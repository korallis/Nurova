import type { Metadata } from 'next';
import { HomeSections } from '@/components/home/HomeSections';
import { getSingle } from '@/lib/content/queries';

// Pre-launch preview of the home page: next.config.ts redirects `/` to
// /coming-soon for now. Delete this route once that redirect is removed.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  alternates: { canonical: '/' },
};

export default async function HomePreviewPage() {
  return <HomeSections content={await getSingle('home')} />;
}
