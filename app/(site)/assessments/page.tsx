import type { Metadata } from 'next';
import { AssessmentsOverview } from '@/components/assessments/AssessmentsOverview';
import { getSingle } from '@/lib/content/queries';

export const metadata: Metadata = {
  title: 'Assessments',
  description: 'ADHD and autism assessments for adults and children: find the right assessment and what happens during it.',
};

export default async function AssessmentsPage() {
  return <AssessmentsOverview content={await getSingle('assessments')} />;
}
