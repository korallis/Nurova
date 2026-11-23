import type { Metadata } from 'next';
import { QualitySections } from '@/components/about/QualitySections';
import { getSingle } from '@/lib/content/queries';

export const metadata: Metadata = {
  title: 'Quality & Clinical Standards',
  description: 'Clinical governance, quality assurance and recognised assessment frameworks behind every Nurova Minds assessment.',
};

export default async function QualityPage() {
  return <QualitySections content={await getSingle('quality')} />;
}
