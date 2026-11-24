import type { Metadata } from 'next';
import { ConditionPage } from '@/components/conditions/ConditionPage';
import { getSingle } from '@/lib/content/queries';

export const metadata: Metadata = { title: 'Executive Function', description: 'What executive function skills are and how difficulties can show up in everyday tasks.' };

export default async function Page() {
  return <ConditionPage content={await getSingle('condition-executive-function')} />;
}
