/**
 * Every editable document on the site. The dashboard lists these, the editor
 * uses their schemas, and the site reads them through lib/content/queries.ts.
 *
 * To make a new page editable: add its type and defaults to pages.ts, its
 * schema to schemas.ts, and an entry here. The dashboard picks it up.
 *
 * Muve Futures also has collections (lists of similar pages such as services,
 * stored as `<collection>:<slug>`); copy that part of its registry across when
 * Nurova needs them.
 */
import type { Field } from './fields';
import {
  DEFAULT_ABOUT,
  DEFAULT_APPROACH,
  DEFAULT_HOME,
  DEFAULT_QUALITY,
  DEFAULT_SETTINGS,
  DEFAULT_TEAM_PAGE,
  type AboutContent,
  type ApproachContent,
  type HomeContent,
  type QualityContent,
  type SettingsContent,
  type TeamPageContent,
} from './pages';
import { aboutSchema, approachSchema, homeSchema, qualitySchema, settingsSchema, teamPageSchema } from './schemas';
import {
  DEFAULT_ADULT_ADHD,
  DEFAULT_ADULT_AUTISM,
  DEFAULT_ADULTS_HUB,
  DEFAULT_ASSESSMENTS_OVERVIEW,
  DEFAULT_CHILD_ADHD,
  DEFAULT_CHILD_AUTISM,
  DEFAULT_CHILDREN_HUB,
  DEFAULT_COMBINED,
  type AssessmentHubContent,
  type AssessmentPageContent,
  type AssessmentsOverviewContent,
} from './assessments';
import { assessmentHubSchema, assessmentPageSchema, assessmentsOverviewSchema } from './assessment-schemas';

interface SingleDef<T> {
  label: string;
  description: string;
  schema: Field;
  defaults: T;
  /** Public page to preview after saving. */
  path: string;
}

export interface SingleTypes {
  settings: SettingsContent;
  home: HomeContent;
  about: AboutContent;
  quality: QualityContent;
  approach: ApproachContent;
  'team-page': TeamPageContent;
  assessments: AssessmentsOverviewContent;
  'assessments-adults': AssessmentHubContent;
  'assessments-children': AssessmentHubContent;
  'assessment-adult-adhd': AssessmentPageContent;
  'assessment-adult-autism': AssessmentPageContent;
  'assessment-child-adhd': AssessmentPageContent;
  'assessment-child-autism': AssessmentPageContent;
  'assessment-combined': AssessmentPageContent;
}

/** The five pages that share the assessment template. */
export type AssessmentPageKey = 'assessment-adult-adhd' | 'assessment-adult-autism' | 'assessment-child-adhd' | 'assessment-child-autism' | 'assessment-combined';

export type SingleKey = keyof SingleTypes;

export const SINGLES: { [K in SingleKey]: SingleDef<SingleTypes[K]> } = {
  settings: {
    label: 'Site settings & coming-soon page',
    description: 'Site name, tagline, search engine text, contact details, office address, social links, footer and the coming-soon page.',
    schema: settingsSchema,
    defaults: DEFAULT_SETTINGS,
    path: '/',
  },
  home: { label: 'Home page', description: 'Every section of the home page.', schema: homeSchema, defaults: DEFAULT_HOME, path: '/home' },
  about: { label: 'About page', description: 'Hero, purpose, mission, vision and values, the team and the closing call to action.', schema: aboutSchema, defaults: DEFAULT_ABOUT, path: '/about' },
  quality: {
    label: 'About › Quality & clinical standards',
    description: 'The hero and the clinical governance section.',
    schema: qualitySchema,
    defaults: DEFAULT_QUALITY,
    path: '/about/quality-and-clinical-standards',
  },
  approach: { label: 'About › Our approach', description: 'The hero and the three steps.', schema: approachSchema, defaults: DEFAULT_APPROACH, path: '/about/our-approach' },
  'team-page': {
    label: 'About › Meet the team',
    description: 'The hero and closing call to action. The people themselves are edited on the About page.',
    schema: teamPageSchema,
    defaults: DEFAULT_TEAM_PAGE,
    path: '/about/team',
  },
  assessments: {
    label: 'Assessments overview',
    description: 'The /assessments page: hero, finder, cards, what happens and professional enquiries.',
    schema: assessmentsOverviewSchema,
    defaults: DEFAULT_ASSESSMENTS_OVERVIEW,
    path: '/assessments',
  },
  'assessments-adults': { label: 'Assessments › Adults', description: 'The adult assessments page.', schema: assessmentHubSchema, defaults: DEFAULT_ADULTS_HUB, path: '/assessments/adults' },
  'assessments-children': { label: 'Assessments › Children', description: 'The children assessments page.', schema: assessmentHubSchema, defaults: DEFAULT_CHILDREN_HUB, path: '/assessments/children' },
  'assessment-adult-adhd': { label: 'Assessments › Adult ADHD', description: 'Every section of the page.', schema: assessmentPageSchema, defaults: DEFAULT_ADULT_ADHD, path: '/assessments/adults/adhd' },
  'assessment-adult-autism': { label: 'Assessments › Adult autism', description: 'Every section of the page.', schema: assessmentPageSchema, defaults: DEFAULT_ADULT_AUTISM, path: '/assessments/adults/autism' },
  'assessment-child-adhd': { label: 'Assessments › Child ADHD', description: 'Every section of the page.', schema: assessmentPageSchema, defaults: DEFAULT_CHILD_ADHD, path: '/assessments/children/adhd' },
  'assessment-child-autism': { label: 'Assessments › Child autism', description: 'Every section of the page.', schema: assessmentPageSchema, defaults: DEFAULT_CHILD_AUTISM, path: '/assessments/children/autism' },
  'assessment-combined': { label: 'Assessments › Combined ADHD & autism', description: 'Every section of the page.', schema: assessmentPageSchema, defaults: DEFAULT_COMBINED, path: '/assessments/adhd-and-autism' },
};

/** Whether `key` names an editable document. Own-property check, so names like "constructor" aren't mistaken for content. */
export const isSingleKey = (key: string): key is SingleKey => Object.hasOwn(SINGLES, key);

/** Cache tags: saving a document refreshes every page that reads it. */
export const contentTag = {
  single: (key: SingleKey) => `content:${key}`,
};
