import type { Metadata } from 'next';
import { RightToChoosePage } from '@/components/right-to-choose/RightToChoosePage';
import { getSingle } from '@/lib/content/queries';

export const metadata: Metadata = {
  title: 'Right to Choose',
  description: 'If you’re registered with a GP in England, you may be able to choose Nurova Minds for your NHS ADHD or autism assessment. Find out how Right to Choose works.',
};

export default async function Page() {
  return <RightToChoosePage content={await getSingle('right-to-choose')} />;
}
