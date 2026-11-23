import type { Metadata } from 'next';
import { TeamPageSections } from '@/components/about/TeamPageSections';
import { getSingle } from '@/lib/content/queries';

export const metadata: Metadata = {
  title: 'Meet the Team',
  description: 'The experienced professionals behind Nurova Minds’ neurodevelopmental assessments and support.',
};

export default async function TeamPage() {
  const [content, about] = await Promise.all([getSingle('team-page'), getSingle('about')]);
  return <TeamPageSections content={content} members={about.team.members} />;
}
