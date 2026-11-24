import type { Metadata } from 'next';
import { ConditionPage } from '@/components/conditions/ConditionPage';
import { getSingle } from '@/lib/content/queries';

export const metadata: Metadata = { title: 'AuDHD', description: 'When ADHD and autism show up together, and why a combined assessment helps.' };

export default async function Page() {
  return <ConditionPage content={await getSingle('condition-audhd')} />;
}
