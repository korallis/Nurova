/**
 * The five support service pages (/support/<service>), sharing one template.
 * Each page owns its hero and closing call to action; the services carousel
 * between them comes from the Support page (support.ts), so a service's card
 * is edited once and shows the same everywhere. Defaults are the copy from
 * the designs.
 */
import type { StrokeTone } from './assessments';
import type { Photo } from './fields';

export interface SupportServicePageContent {
  /** The coral label above the hero. */
  label: string;
  hero: {
    title: string;
    body: string;
    /** A cut-out standing on the card's bottom edge on the right, its head above the card. */
    image: Photo | null;
    primaryCta: string;
    secondaryCta: string;
  };
  /** The heading above the services carousel. */
  servicesTitle: string;
  closing: { title: string; body: string; primaryCta: string; secondaryCta: string; strokeLeft: StrokeTone; strokeRight: StrokeTone };
}

/**
 * Every cut-out is exported in the same frame (760 × 901 design px, its
 * bottom-right corner on the card's), so they all sit where their design has them.
 */
const cutout = (folder: string, alt: string): Photo => ({ src: `/images/support/${folder}/hero.webp`, alt, width: 760, height: 901 });

const page = (label: string, folder: string, alt: string, title: string, body: string, closingTitle: string): SupportServicePageContent => ({
  label,
  hero: { title, body, image: cutout(folder, alt), primaryCta: 'Explore Our Support', secondaryCta: 'Contact Us' },
  servicesTitle: 'Our support services',
  closing: {
    title: closingTitle,
    body: 'Wherever you are in your journey, our team is here to listen, understand your\nneeds and help you explore the support options available to you.',
    primaryCta: 'Explore Assessments',
    secondaryCta: 'Get in Touch',
    strokeLeft: 'pink',
    strokeRight: 'pink',
  },
});

export const DEFAULT_SUPPORT_POST_DIAGNOSTIC = page(
  'Post-Diagnostic Support',
  'post-diagnostic-support',
  'A smiling woman with her hands on her cheeks',
  'Diagnosis is the beginning,\nnot the destination.',
  'Receiving a diagnosis can bring relief, clarity and validation, but it often raises new questions. Nurova Minds supports you beyond diagnosis with practical guidance, evidence-based interventions and personalised support.',
  'You don’t have to\nfigure it all out alone.'
);

export const DEFAULT_SUPPORT_ADHD_COACHING = page(
  'ADHD Coaching',
  'adhd-coaching',
  'A laughing young man pointing to the side',
  'Turning understanding\ninto action.',
  'ADHD coaching helps bridge the gap between understanding ADHD and learning how to thrive with it. Coaching is practical, collaborative and goal focused.',
  'Small changes can\ncreate lasting impact.'
);

export const DEFAULT_SUPPORT_THERAPY = page(
  'Therapy',
  'therapy',
  'A woman with curly hair smiling and clenching her fists in excitement',
  'Support that\nunderstands you.',
  'Our therapy services support neurodivergent people experiencing anxiety, low self-esteem, emotional overwhelm, burnout, relationship difficulties or challenges navigating work, education and everyday life.',
  'Invest in\nyour wellbeing.'
);

export const DEFAULT_SUPPORT_MEDICATION = page(
  'ADHD Medication Pathway',
  'medication-pathway',
  'A laughing young woman in a striped shirt',
  'Making informed decisions\nabout medication.',
  'Medication is one of several treatment options for ADHD. Nurova Minds provides balanced information and clinical guidance so people can make informed decisions.',
  'Understand your options with\nconfidence.'
);

export const DEFAULT_SUPPORT_PARENT = page(
  'Parent Support',
  'parent-support',
  'A smiling mother with her daughter hugging her from behind',
  'Supporting parents to\nsupport their children.',
  'Whether your child has recently received a diagnosis or you are beginning to explore neurodevelopmental differences, Nurova Minds provides guidance, reassurance and practical advice.',
  'Helping families move forward\ntogether.'
);
