import type { Metadata } from 'next';
import { AssessmentHub } from '@/components/assessments/AssessmentHub';
import { getSingle } from '@/lib/content/queries';

export const metadata: Metadata = { title: 'Adult Assessments', description: 'ADHD, autism and combined assessments for adults, with compassionate, evidence-based care.' };

export default async function Page() {
  return <AssessmentHub content={await getSingle('assessments-adults')} headingId="adults-heading" />;
}
