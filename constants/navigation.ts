/**
 * Every page address the site links to, in one place. Most pages are still to
 * be built: the links are ready for them, and change here if an address does.
 */
export const ROUTES = {
  home: '/',
  about: '/about',
  team: '/about/team',
  ourApproach: '/about/our-approach',
  quality: '/about/quality-and-clinical-standards',
  assessments: '/assessments',
  adultAssessments: '/assessments/adults',
  childAssessments: '/assessments/children',
  adultAdhd: '/assessments/adults/adhd',
  adultAutism: '/assessments/adults/autism',
  childAdhd: '/assessments/children/adhd',
  childAutism: '/assessments/children/autism',
  combinedAssessment: '/assessments/adhd-and-autism',
  assessmentJourney: '/assessments#journey',
  conditions: '/conditions',
  support: '/support',
  rightToChoose: '/right-to-choose',
  professionals: '/for-professionals',
  resources: '/resources',
  faqs: '/resources/faqs',
  policies: '/resources/policies-and-procedures',
  contact: '/contact',
  book: '/book-an-assessment',
  referrerPortal: '/referrer-portal',
  accessibility: '/accessibility',
  terms: '/terms-and-conditions',
  revokeConsents: '/revoke-consents',
  privacy: '/privacy-policy',
  feedback: '/feedback-and-complaints',
  careers: '/careers',
} as const;

export type PageId = 'home' | 'about' | 'assessments' | 'conditions' | 'support' | 'right-to-choose' | 'for-professionals' | 'resources' | 'contact';

export interface NavItem {
  label: string;
  href: string;
  /** Bold, e.g. the section's own page at the top of its dropdown. */
  bold?: boolean;
  /** Pages under this one, shown indented and in italics. */
  children?: NavItem[];
}

export interface NavLinkConfig {
  id: PageId;
  label: string;
  href: string;
  /** The pages listed in this item's dropdown. */
  dropdown?: NavItem[];
}

/** The main menu, in order. Contact and "Book an Assessment" are buttons at the end. */
export const NAV_LINKS: NavLinkConfig[] = [
  { id: 'home', label: 'Home', href: ROUTES.home },
  {
    id: 'about',
    label: 'About',
    href: ROUTES.about,
    dropdown: [
      { label: 'About Nurova Minds', href: ROUTES.about },
      { label: 'Meet the Team', href: ROUTES.team },
      { label: 'Our Approach', href: ROUTES.ourApproach },
      { label: 'Quality & Clinical Standards', href: ROUTES.quality },
    ],
  },
  {
    id: 'assessments',
    label: 'Assessments',
    href: ROUTES.assessments,
    dropdown: [
      { label: 'Assessments', href: ROUTES.assessments, bold: true },
      {
        label: 'Adult Assessments',
        href: ROUTES.adultAssessments,
        children: [
          { label: 'Adult ADHD Assessments', href: ROUTES.adultAdhd },
          { label: 'Adult Autism Assessments', href: ROUTES.adultAutism },
        ],
      },
      {
        label: 'Child Assessments',
        href: ROUTES.childAssessments,
        children: [
          { label: 'Child ADHD Assessments', href: ROUTES.childAdhd },
          { label: 'Child Autism Assessments', href: ROUTES.childAutism },
        ],
      },
      { label: 'Combined ADHD & Autism', href: ROUTES.combinedAssessment },
    ],
  },
  {
    id: 'conditions',
    label: 'Conditions',
    href: ROUTES.conditions,
    dropdown: [
      { label: 'ADHD', href: '/conditions/adhd' },
      { label: 'Autism', href: '/conditions/autism' },
      { label: 'AuDHD', href: '/conditions/audhd' },
      { label: 'Dyslexia', href: '/conditions/dyslexia' },
      { label: 'Dyspraxia', href: '/conditions/dyspraxia' },
    ],
  },
  {
    id: 'support',
    label: 'Support',
    href: ROUTES.support,
    dropdown: [
      { label: 'Post-Diagnostic Support', href: '/support/post-diagnostic-support' },
      { label: 'ADHD Coaching', href: '/support/adhd-coaching' },
      { label: 'Therapy', href: '/support/therapy' },
      { label: 'Medication Pathway', href: '/support/medication-pathway' },
      { label: 'Parent Support', href: '/support/parent-support' },
    ],
  },
  { id: 'right-to-choose', label: 'Right to Choose', href: ROUTES.rightToChoose },
  {
    id: 'for-professionals',
    label: 'For Professionals',
    href: ROUTES.professionals,
    dropdown: [
      { label: 'Schools', href: '/for-professionals/schools' },
      { label: 'Employers', href: '/for-professionals/employers' },
      { label: 'Local Authorities', href: '/for-professionals/local-authorities' },
    ],
  },
  {
    id: 'resources',
    label: 'Resources',
    href: ROUTES.resources,
    dropdown: [
      { label: 'FAQs', href: ROUTES.faqs },
      { label: 'Policies & Procedures', href: ROUTES.policies },
      { label: 'Case Studies & Impact', href: '/resources/case-studies' },
      { label: 'Accessibility', href: ROUTES.accessibility },
    ],
  },
];

export const CONTACT_LINK: NavLinkConfig = {
  id: 'contact',
  label: 'Contact',
  href: ROUTES.contact,
  dropdown: [
    { label: 'Get in Touch', href: ROUTES.contact },
    { label: 'Careers', href: ROUTES.careers },
    { label: 'Referrer Portal', href: ROUTES.referrerPortal },
  ],
};

export const BOOK_LINK = { label: 'Book an Assessment', href: ROUTES.book };

/** Footer "Quick Links", in three columns. */
export const FOOTER_LINKS: { label: string; href: string }[][] = [
  [
    { label: 'About', href: ROUTES.about },
    { label: 'Referrer Portal', href: ROUTES.referrerPortal },
    { label: 'Accessibility', href: ROUTES.accessibility },
  ],
  [
    { label: 'Terms + Conditions', href: ROUTES.terms },
    { label: 'Revoke consents', href: ROUTES.revokeConsents },
    { label: 'Privacy Policy', href: ROUTES.privacy },
  ],
  [
    { label: 'Feedback & Complaints', href: ROUTES.feedback },
    { label: 'Careers', href: ROUTES.careers },
    { label: 'Contact', href: ROUTES.contact },
  ],
];

/** Which menu item a page belongs to, from its address (including the pages in its dropdown, such as /careers under Contact). */
export function activePage(pathname: string): PageId {
  const path = pathname.replace(/\/+$/, '') || '/';
  const [segment] = path.replace(/^\//, '').split('/');
  const match = [...NAV_LINKS, CONTACT_LINK].find(
    (link) => link.href === `/${segment}` || link.dropdown?.some((item) => [item, ...(item.children ?? [])].some((i) => i.href.split('#')[0] === path))
  );
  return match?.id ?? 'home';
}
