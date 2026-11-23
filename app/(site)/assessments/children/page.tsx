import type { Metadata } from 'next';
import { AssessmentHub } from '@/components/assessments/AssessmentHub';
import { getSingle } from '@/lib/content/queries';

export const metadata: Metadata = { title: 'Children Assessments', description: 'ADHD, autism and combined assessments for children, with clear answers and practical recommendations.' };

export default async function Page() {
  return <AssessmentHub content={await getSingle('assessments-children')} headingId="children-heading" />;
}
