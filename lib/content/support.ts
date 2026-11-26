/**
 * The Support page (/support). Defaults are the copy from the design; the
 * four services after Post-Diagnostic Support are starter copy to review.
 */
import type { StrokeTone } from './assessments';
import type { Photo } from './fields';

const photo = (src: string, alt: string, width: number, height: number): Photo => ({ src, alt, width, height });

export interface SupportService {
  /** The button above the card. */
  tab: string;
  title: string;
  /** The bold line under the title. */
  subtitle: string;
  body: string;
  points: string[];
  /** The “Learn More” link. */
  href: string;
  /** Fills the right of the card. */
  image: Photo | null;
}

export interface SupportContent {
  /** The coral label above the hero. */
  label: string;
  hero: { title: string; body: string; image: Photo | null; primaryCta: string; secondaryCta: string };
  /** "Different minds. Different needs.": centred heading, text and a button. */
  intro: { title: string; body: string; cta: string };
  /** The carousel of services, one card at a time. */
  services: { cta: string; items: SupportService[] };
  closing: { title: string; body: string; primaryCta: string; secondaryCta: string; strokeLeft: StrokeTone; strokeRight: StrokeTone };
}

export const DEFAULT_SUPPORT: SupportContent = {
  label: 'Support',
  hero: {
    title: 'Understanding is\njust the beginning.',
    body: 'Whether you are exploring neurodivergence, navigating a recent diagnosis or looking for support with everyday life, we are here to help. Our personalised, neuro-affirming support services help individuals and families build confidence, develop practical strategies and move forward in a way that feels right for them.',
    image: photo('/images/support/hero-cutout.webp', 'Four hands holding each other’s wrists in a square', 2320, 1524),
    primaryCta: 'Explore Our Support',
    secondaryCta: 'Contact Us',
  },
  intro: {
    title: 'Different minds.\nDifferent needs.',
    body: 'No two experiences of neurodivergence are the same. Explore our range of support services,\ndesigned around your individual needs, strengths, goals and circumstances.',
    cta: 'Our Approach',
  },
  services: {
    cta: 'Learn More',
    items: [
      {
        tab: 'Post-Diagnostic Support',
        title: 'Post-Diagnostic Support',
        subtitle: 'Make sense of your diagnosis.',
        body: 'A diagnosis can bring clarity, relief and new questions. We help you understand what your diagnosis means for you and explore practical ways to navigate everyday life.',
        points: ['Understanding your diagnosis', 'Personalised recommendations', 'Practical everyday strategies', 'Guidance and signposting', 'Exploring ongoing support options'],
        href: '/support/post-diagnostic-support',
        image: photo('/images/support/post-diagnostic.webp', 'A young person talking with a clinician on a sofa', 589, 581),
      },
      {
        tab: 'ADHD Coaching',
        title: 'ADHD Coaching',
        subtitle: 'Turn strategies into everyday habits.',
        body: 'ADHD coaching helps you build routines around the way your brain works. Together with your coach, you set goals that matter to you and find practical ways to manage time, focus and motivation.',
        points: ['Goal setting and accountability', 'Time management and planning', 'Organisation and routines', 'Focus and motivation strategies', 'Building confidence'],
        href: '/support/adhd-coaching',
        image: photo('/images/assessments/adults/adhd/why.webp', 'A woman going through a form on a tablet with a clinician', 1500, 1290),
      },
      {
        tab: 'Therapy',
        title: 'Therapy',
        subtitle: 'Support for your wellbeing.',
        body: 'Neuro-affirming therapy gives you space to explore your experiences, understand your emotions and develop ways of coping that work for you.',
        points: ['Emotional regulation', 'Anxiety and low mood', 'Self-understanding and identity', 'Coping strategies', 'Relationships and communication'],
        href: '/support/therapy',
        image: photo('/images/conditions/audhd/hero.webp', 'A young person sitting with their knees drawn up during a session', 1500, 1528),
      },
      {
        tab: 'ADHD Medication Pathway',
        title: 'ADHD Medication Pathway',
        subtitle: 'Find out whether medication is right for you.',
        body: 'If medication may be suitable after an ADHD diagnosis, we explain the options and what to expect, then start and review treatment carefully with you.',
        points: [
          'Review of whether medication is suitable',
          'Clear information about the options',
          'Careful dose adjustment and monitoring',
          'Regular reviews',
          'Guidance on working with your GP',
        ],
        href: '/support/medication-pathway',
        image: photo('/images/about/team/hero.webp', 'A clinician taking notes during a session', 2560, 1192),
      },
      {
        tab: 'Parent & Family Support',
        title: 'Parent & Family Support',
        subtitle: 'Help for the whole family.',
        body: 'Understanding your child’s needs can change how everyday life feels at home. We help parents and carers learn practical approaches so they can support their child with confidence.',
        points: [
          'Understanding your child’s profile',
          'Practical strategies for home',
          'Guidance on support at school',
          'Managing routines and transitions',
          'Support for the wider family',
        ],
        href: '/support/parent-support',
        image: photo('/images/assessments/combined/why.webp', 'A mother and daughter doing a jigsaw puzzle together', 1500, 1290),
      },
    ],
  },
  closing: {
    title: 'You don’t have to\nfigure it all out alone.',
    body: 'Wherever you are in your journey, our team is here to listen, understand your\nneeds and help you explore the support options available to you.',
    primaryCta: 'Explore Assessments',
    secondaryCta: 'Get in Touch',
    strokeLeft: 'pink',
    strokeRight: 'pink',
  },
};
