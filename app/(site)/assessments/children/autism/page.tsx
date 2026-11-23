import type { Metadata } from 'next';
import { AssessmentPage } from '@/components/assessments/AssessmentPage';
import { getSingle } from '@/lib/content/queries';

export const metadata: Metadata = { title: 'Child Autism Assessments', description: 'Child autism assessments focused on strengths, support needs and practical outcomes.' };

export default async function Page() {
  // Where the cut-out photo sits, measured from the design.
  return <AssessmentPage content={await getSingle('assessment-child-autism')} photoBox={{ width: 1043, height: 1564, right: -233, top: -193 }} />;
}
