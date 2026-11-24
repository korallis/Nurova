import type { Metadata } from 'next';
import { ConditionPage } from '@/components/conditions/ConditionPage';
import { getSingle } from '@/lib/content/queries';

export const metadata: Metadata = { title: 'Dyspraxia', description: 'What dyspraxia (DCD) is, common characteristics, and assessment and support with Nurova Minds.' };

export default async function Page() {
  return <ConditionPage content={await getSingle('condition-dyspraxia')} />;
}
