/**
 * Every page address the site links to, in one place. Most pages are still to
 * be built: the links are ready for them, and change here if an address does.
 */
export const ROUTES = {
  home: '/',
  about: '/about',
  assessments: '/assessments',
  adhdAssessment: '/assessments/adhd',
  autismAssessment: '/assessments/autism',
  combinedAssessment: '/assessments/adhd-and-autism',
  assessmentJourney: '/assessments#journey',
  conditions: '/conditions',
  support: '/support',
  rightToChoose: '/right-to-choose',
  professionals: '/for-professionals',
  resources: '/resources',
  faqs: '/resources#faqs',
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

export interface NavLinkConfig {
  id: PageId;
  label: string;
  href: string;
}

/** The main menu, in order. Contact and "Book an Assessment" are buttons at the end. */
export const NAV_LINKS: NavLinkConfig[] = [
  { id: 'home', label: 'Home', href: ROUTES.home },
  { id: 'about', label: 'About', href: ROUTES.about },
  { id: 'assessments', label: 'Assessments', href: ROUTES.assessments },
  { id: 'conditions', label: 'Conditions', href: ROUTES.conditions },
  { id: 'support', label: 'Support', href: ROUTES.support },
  { id: 'right-to-choose', label: 'Right to Choose', href: ROUTES.rightToChoose },
  { id: 'for-professionals', label: 'For Professionals', href: ROUTES.professionals },
  { id: 'resources', label: 'Resources', href: ROUTES.resources },
];

export const CONTACT_LINK: NavLinkConfig = { id: 'contact', label: 'Contact', href: ROUTES.contact };
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

/** Which menu item a page belongs to, from its address. */
export function activePage(pathname: string): PageId {
  const [segment] = pathname.replace(/^\//, '').split('/');
  const match = [...NAV_LINKS, CONTACT_LINK].find((link) => link.href === `/${segment}`);
  return match?.id ?? 'home';
}
