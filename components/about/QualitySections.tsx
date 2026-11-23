import { FrostedHero } from '@/components/common/FrostedHero';
import { SplitFeature } from '@/components/common/SplitFeature';
import { ClosingCta } from '@/components/home/ClosingCta';
import { ROUTES } from '@/constants';
import type { QualityContent } from '@/lib/content/pages';

/** Quality & clinical standards; `content` is edited in the dashboard (Website content → About › Quality & clinical standards). */
export function QualitySections({ content }: { content: QualityContent }) {
  const { hero, governance } = content;
  return (
    <div className="flex w-full flex-col overflow-x-clip">
      {/* "Clinical excellence you can trust." */}
      <FrostedHero
        id="quality-heading"
        label={hero.label}
        title={hero.title}
        body={hero.body}
        image={hero.image}
        primary={{ label: hero.primaryCta, href: ROUTES.policies }}
        secondary={{ label: hero.secondaryCta, href: ROUTES.contact }}
      />
      {/* "Clinical governance & quality assurance" */}
      <SplitFeature
        id="governance-heading"
        title={governance.title}
        body={governance.body}
        image={governance.image}
        cta={{ label: governance.cta, href: ROUTES.contact }}
        className="mt-16 sm:mt-20 xl:u-mt-105"
      />
      <ClosingCta content={content.closing} variant="quality" />
    </div>
  );
}
