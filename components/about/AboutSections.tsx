import { ClosingCta } from '@/components/home/ClosingCta';
import type { AboutContent } from '@/lib/content/pages';
import { AboutHero } from './AboutHero';
import { PillarCards } from './PillarCards';
import { PurposeSection } from './PurposeSection';
import { TeamSection } from './TeamSection';

/** About page sections; `content` is edited in the dashboard (Website content → About page). */
export function AboutSections({ content }: { content: AboutContent }) {
  // Laid out in design units from `xl` up, like the home page; see app/globals.css.
  return (
    <div className="flex w-full flex-col overflow-x-clip">
      <AboutHero content={content.hero} />
      <PurposeSection content={content.purpose} />
      <PillarCards pillars={content.pillars} />
      <TeamSection content={content.team} />
      <ClosingCta content={content.closing} variant="about" />
    </div>
  );
}
