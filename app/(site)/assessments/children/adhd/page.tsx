import type { Metadata } from 'next';
import { AssessmentPage } from '@/components/assessments/AssessmentPage';
import { getSingle } from '@/lib/content/queries';

export const metadata: Metadata = { title: 'Child ADHD Assessments', description: 'Child ADHD assessments that help families understand their child’s needs and access practical support.' };

export default async function Page() {
  // Where the cut-out photo sits, measured from the design.
  return <AssessmentPage content={await getSingle('assessment-child-adhd')} photoBox={{ width: 1229, height: 906, right: -103, top: -28 }} />;
}
