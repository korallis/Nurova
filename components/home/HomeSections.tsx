import type { HomeContent } from '@/lib/content/pages';
import { AssessmentCarousel } from './AssessmentCarousel';
import { ClosingCta } from './ClosingCta';
import { HeroSection } from './HeroSection';
import { HelpSection } from './HelpSection';
import { JourneySection } from './JourneySection';
import { MoreAndFaqSection } from './MoreAndFaqSection';
import { QuoteSection } from './QuoteSection';
import { WhyChooseSection } from './WhyChooseSection';

/** Home page sections; `content` is edited in the dashboard (Website content → Home page). */
export function HomeSections({ content }: { content: HomeContent }) {
  // Sections are laid out in design units from `xl` up; see app/globals.css.
  return (
    <div className="flex w-full flex-col overflow-x-clip">
      <HeroSection content={content.hero} />
      <QuoteSection content={content.quote} />
      <AssessmentCarousel cards={content.assessments} />
      <WhyChooseSection content={content.whyChoose} />
      <JourneySection content={content.journey} />
      <HelpSection content={content.help} />
      <MoreAndFaqSection more={content.afterAssessment} faq={content.faq} />
      <ClosingCta content={content.closing} />
    </div>
  );
}
