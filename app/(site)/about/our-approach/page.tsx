import type { Metadata } from 'next';
import { ApproachSections } from '@/components/about/ApproachSections';
import { getSingle } from '@/lib/content/queries';

export const metadata: Metadata = {
  title: 'Our Approach',
  description: 'Understanding first, support always: how Nurova Minds listens, explains and supports you through your assessment.',
};

export default async function ApproachPage() {
  return <ApproachSections content={await getSingle('approach')} />;
}
