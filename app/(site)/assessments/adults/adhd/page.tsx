import type { Metadata } from 'next';
import { AssessmentPage } from '@/components/assessments/AssessmentPage';
import { getSingle } from '@/lib/content/queries';

export const metadata: Metadata = { title: 'Adult ADHD Assessments', description: 'Understand yourself with confidence: compassionate, evidence-based adult ADHD assessments.' };

export default async function Page() {
  // Where the cut-out photo sits, measured from the design.
  return <AssessmentPage content={await getSingle('assessment-adult-adhd')} photoBox={{ width: 856, height: 1076, right: 0, top: -32 }} />;
}
