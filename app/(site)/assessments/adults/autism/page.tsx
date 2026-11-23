import type { Metadata } from 'next';
import { AssessmentPage } from '@/components/assessments/AssessmentPage';
import { getSingle } from '@/lib/content/queries';

export const metadata: Metadata = { title: 'Adult Autism Assessments', description: 'Adult autism assessments with compassion, respect and clinical expertise.' };

export default async function Page() {
  // Where the cut-out photo sits, measured from the design.
  return <AssessmentPage content={await getSingle('assessment-adult-autism')} photoBox={{ width: 812, height: 1218, right: -63, top: 12 }} />;
}
