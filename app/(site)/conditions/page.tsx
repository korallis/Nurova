import type { Metadata } from 'next';
import { AssessmentsOverview } from '@/components/assessments/AssessmentsOverview';
import { getSingle } from '@/lib/content/queries';

export const metadata: Metadata = {
  title: 'Conditions',
  description: 'ADHD, autism, AuDHD, dyslexia, dyspraxia and executive function: how each can show up in everyday life and what support may help.',
};

export default async function ConditionsPage() {
  return <AssessmentsOverview content={await getSingle('conditions')} headingId="conditions-heading" cardsLabel="All conditions" wideHero />;
}
