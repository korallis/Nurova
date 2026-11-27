/**
 * The Support page (/support). Defaults are the copy from the designs. The
 * services carousel here is also shown on each service page (support-services.ts).
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
        image: photo('/images/support/post-diagnostic-support/card.webp', 'A young person talking with a clinician on a sofa', 589, 581),
      },
      {
        tab: 'ADHD Coaching',
        title: 'ADHD Coaching',
        subtitle: 'Turn understanding into action.',
        body: 'Practical, collaborative and goal-focused coaching that helps you work with your ADHD, recognise your strengths and develop strategies that fit your life.',
        points: ['Time management and organisation', 'Planning and prioritisation', 'Building sustainable routines', 'Work and study strategies', 'Confidence and goal setting'],
        href: '/support/adhd-coaching',
        image: photo('/images/support/adhd-coaching/card.webp', 'A young woman smiling while studying at a table with a friend', 589, 581),
      },
      {
        tab: 'Therapy',
        title: 'Therapy',
        subtitle: 'A space to feel understood.',
        body: 'Compassionate, neuro-affirming therapy for children, adults and families, supporting emotional wellbeing and helping you navigate life’s challenges without feeling the need to change who you are.',
        points: ['Anxiety and stress', 'Emotional regulation', 'Self-esteem and confidence', 'Burnout and overwhelm', 'Relationships and life transitions'],
        href: '/support/therapy',
        image: photo('/images/support/therapy/card.webp', 'A group sitting in a circle during a therapy session', 589, 581),
      },
      {
        tab: 'ADHD Medication Pathway',
        title: 'ADHD Medication Pathway',
        subtitle: 'Make informed decisions about your care.',
        body: 'Medication is one of several treatment options for ADHD. Our clinical team can help you understand your options and explore whether medication may be appropriate for you.',
        points: [
          'Medication consultations',
          'Exploring treatment options',
          'Titration, where clinically appropriate',
          'Monitoring and medication reviews',
          'Ongoing clinical guidance',
        ],
        href: '/support/medication-pathway',
        image: photo('/images/support/medication-pathway/card.webp', 'A smiling woman holding a tablet between her fingers', 589, 581),
      },
      {
        tab: 'Parent & Family Support',
        title: 'Parent & Family Support',
        subtitle: 'Helping families move forward together.',
        body: 'Personalised guidance for parents and carers who want to better understand their child’s needs, recognise their strengths and feel more confident supporting them.',
        points: [
          'Understanding neurodivergence',
          'Home routines and practical strategies',
          'Communication and emotional wellbeing',
          'Navigating educational support',
          'Building parental confidence',
        ],
        href: '/support/parent-support',
        image: photo('/images/support/parent-support/card.webp', 'Parents talking with their daughter at the kitchen table', 589, 581),
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
