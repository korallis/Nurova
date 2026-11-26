import type { Metadata } from 'next';
import { FaqsPage } from '@/components/resources/FaqsPage';
import { getSingle } from '@/lib/content/queries';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions',
  description: 'Answers to common questions about ADHD and autism assessments, Right to Choose, referrals, bookings and support at Nurova Minds.',
};

export default async function Page() {
  return <FaqsPage content={await getSingle('faqs')} />;
}
