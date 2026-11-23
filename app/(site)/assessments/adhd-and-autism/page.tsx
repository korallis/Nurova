import type { Metadata } from 'next';
import { AssessmentPage } from '@/components/assessments/AssessmentPage';
import { getSingle } from '@/lib/content/queries';

export const metadata: Metadata = { title: 'Combined ADHD & Autism Assessment', description: 'One assessment, a clearer understanding: a combined ADHD and autism pathway for adults and children.' };

export default async function Page() {
  return <AssessmentPage content={await getSingle('assessment-combined')} />;
}
