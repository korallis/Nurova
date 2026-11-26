import type { Metadata } from 'next';
import { SupportPage } from '@/components/support/SupportPage';
import { getSingle } from '@/lib/content/queries';

export const metadata: Metadata = {
  title: 'Support',
  description: 'Neuro-affirming support after assessment: post-diagnostic support, ADHD coaching, therapy, the ADHD medication pathway and parent and family support.',
};

export default async function Page() {
  return <SupportPage content={await getSingle('support')} />;
}
