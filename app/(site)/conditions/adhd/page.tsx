import type { Metadata } from 'next';
import { ConditionPage } from '@/components/conditions/ConditionPage';
import { getSingle } from '@/lib/content/queries';

export const metadata: Metadata = { title: 'ADHD', description: 'What ADHD is, how it can show up in everyday life, and assessment and support with Nurova Minds.' };

export default async function Page() {
  return <ConditionPage content={await getSingle('condition-adhd')} />;
}
