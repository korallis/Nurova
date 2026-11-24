import type { Metadata } from 'next';
import { ConditionPage } from '@/components/conditions/ConditionPage';
import { getSingle } from '@/lib/content/queries';

export const metadata: Metadata = { title: 'Dyslexia', description: 'What dyslexia is, common signs, and assessment and support with Nurova Minds.' };

export default async function Page() {
  return <ConditionPage content={await getSingle('condition-dyslexia')} />;
}
