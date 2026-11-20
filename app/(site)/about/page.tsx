import type { Metadata } from 'next';
import { AboutSections } from '@/components/about/AboutSections';
import { getSingle } from '@/lib/content/queries';

export const metadata: Metadata = {
  title: 'About',
  description: 'Nurova Minds provides compassionate, evidence-based neurodevelopmental assessments and ongoing support.',
};

export default async function AboutPage() {
  return <AboutSections content={await getSingle('about')} />;
}
