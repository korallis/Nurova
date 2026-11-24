/**
 * The assessment pages: the overview (/assessments), the adult and children
 * hubs, and the five assessment pages that share one template. Defaults are
 * the copy from the designs.
 */
import { ROUTES } from '@/constants';
import type { Photo } from './fields';
import type { AssessmentCard } from './pages';

const photo = (src: string, alt: string, width: number, height: number): Photo => ({ src, alt, width, height });

// ── Colour choices (shown as options in the dashboard) ─────────────────────

/** A step in "Our assessment process". */
export const STEP_TONES = { purple: 'Deep purple', violet: 'Violet', lavender: 'Lavender', coral: 'Coral', salmon: 'Salmon', pink: 'Pink' } as const;
export type StepTone = keyof typeof STEP_TONES;

/** The card under the hero. */
export const CALLOUT_TONES = { coral: 'Coral', purple: 'Deep purple', violet: 'Violet' } as const;
export type CalloutTone = keyof typeof CALLOUT_TONES;

/** The FAQ card. */
export const FAQ_TONES = { coral: 'Coral', purple: 'Deep purple', lavender: 'Lavender', pink: 'Pink', coralSoft: 'Coral, soft questions' } as const;
export type FaqTone = keyof typeof FAQ_TONES;

/** The hand-drawn strokes by the closing call to action. */
export const STROKE_TONES = { pink: 'Pink', lavender: 'Lavender', violet: 'Violet', coral: 'Coral', salmon: 'Salmon' } as const;
export type StrokeTone = keyof typeof STROKE_TONES;

// ── The five assessment pages ──────────────────────────────────────────────

export interface ProcessStep {
  title: string;
  tone: StepTone;
}

export interface Faq {
  question: string;
  answer: string;
}

export interface AssessmentPageContent {
  /** The coral label above the hero. */
  label: string;
  hero: {
    /** `photo`: a tinted photo fills the card. `cutout`: a cut-out photo stands on the right of a white hero. */
    style: 'photo' | 'cutout';
    title: string;
    /** A blank line starts a new paragraph. */
    body: string;
    image: Photo | null;
    primaryCta: string;
    secondaryCta: string;
  };
  callout: { tone: CalloutTone; title: string; body: string; primaryCta: string; secondaryCta: string };
  process: { title: string; steps: ProcessStep[] };
  why: { title: string; body: string; image: Photo | null; cta: string };
  included: { title: string; body: string; primaryCta: string; secondaryCta: string };
  faq: { tone: FaqTone; title: string; items: Faq[]; cta: string };
  closing: { title: string; body: string; primaryCta: string; secondaryCta: string; strokeLeft: StrokeTone; strokeRight: StrokeTone };
}

const process = (titles: string[], tones: StepTone[]) => ({
  title: 'Our assessment process',
  steps: titles.map((title, i) => ({ title, tone: tones[i] })),
});

const included = (body: string) => ({ title: 'What’s included?', body, primaryCta: 'Speak to a Specialist', secondaryCta: 'Contact Us' });
const why = (body: string, image: Photo | null) => ({ title: 'Why choose\nNurova Minds?', body, image, cta: 'Speak to a Specialist' });
const callout = (tone: CalloutTone, title: string, body: string) => ({ tone, title, body, primaryCta: 'Book an Assessment', secondaryCta: 'For Professionals' });
const hero = (style: 'photo' | 'cutout', title: string, body: string, image: Photo | null) => ({
  style,
  title,
  body,
  image,
  primaryCta: 'Book an Assessment',
  secondaryCta: 'Speak to a Specialist',
});

export const DEFAULT_COMBINED: AssessmentPageContent = {
  label: 'Combined ADHD & Autism Assessment',
  hero: hero(
    'photo',
    'One assessment.\nA clearer understanding.',
    'ADHD and Autism can share characteristics, and many people experience traits associated with both. Our combined pathway considers the whole person and helps identify the most appropriate diagnosis and support.',
    photo('/images/assessments/combined/hero.webp', 'A young person talking with a clinician', 2560, 1037)
  ),
  callout: callout(
    'coral',
    'Why choose a combined\nassessment?',
    'A holistic evaluation can reduce duplication, streamline the journey, produce one integrated report and provide recommendations based on the individual’s full profile.'
  ),
  process: process(
    ['Initial Consultation', 'Comprehensive History', 'Standardised Tools', 'Clinical Interviews', 'Feedback', 'Integrated report and practical recommendations'],
    ['purple', 'violet', 'coral', 'salmon', 'pink', 'purple']
  ),
  why: why(
    'Multidisciplinary clinicians who understand overlapping neurodevelopmental presentations and assess the whole individual.',
    photo('/images/assessments/combined/why.webp', 'A mother and daughter doing a jigsaw puzzle together', 1500, 1290)
  ),
  included: included('Combined review of attention, communication, executive functioning, sensory processing, behaviour patterns and emotional regulation.'),
  faq: {
    tone: 'coral',
    title: 'Frequently Asked Questions',
    items: [
      {
        question: 'Can a combined assessment lead to a diagnosis of both ADHD and autism?',
        answer: 'Yes. The outcome may be an ADHD diagnosis, an autism diagnosis, both diagnoses or neither. Your clinician will explain the findings and how they reached their conclusions.',
      },
      {
        question: 'Can I have a combined assessment if I’m unsure whether it’s ADHD or autism?',
        answer: 'Yes. A combined assessment is designed for exactly this. We look at both together, so you don’t need to know which it might be before you book.',
      },
    ],
    cta: 'View All FAQ’s',
  },
  closing: {
    title: 'Clarity begins with understanding\nthe whole picture.',
    body: 'Receive expert guidance tailored to your individual journey.',
    primaryCta: 'Book an Assessment',
    secondaryCta: 'Speak to a Specialist',
    strokeLeft: 'pink',
    strokeRight: 'lavender',
  },
};

export const DEFAULT_CHILD_AUTISM: AssessmentPageContent = {
  label: 'Child Autism Assessments',
  hero: hero(
    'cutout',
    'Helping children be\nunderstood.',
    'If your child finds communication, social interaction, sensory experiences or changes in routine particularly challenging, an Autism assessment may help provide the understanding needed to support their development.',
    photo('/images/assessments/children/autism/hero.webp', 'A smiling girl with braided hair', 1100, 1649)
  ),
  callout: callout(
    'coral',
    'Why families seek an assessment?',
    'Parents may notice differences in communication, friendships, sensory responses, managing routine changes, emotional expression, play or school engagement.'
  ),
  process: process(
    [
      'Parent consultation',
      'Review of your child’s developmental history',
      'Clinical observations',
      'Standardised assessment tools',
      'Information from your child’s school, where appropriate',
      'Feedback and a written report',
    ],
    ['purple', 'violet', 'coral', 'salmon', 'pink', 'purple']
  ),
  why: why(
    'Every child deserves to be understood rather than compared. Assessments focus on strengths, support needs and practical outcomes.',
    photo('/images/assessments/children/autism/why.webp', 'A girl playing with shapes at a table while a clinician takes notes', 1500, 1290)
  ),
  included: included('Parent consultation, observations, school input where appropriate, assessment tools, feedback and comprehensive report.'),
  faq: {
    tone: 'purple',
    title: 'Frequently Asked Questions',
    items: [
      {
        question: 'Can my child’s school contribute to the assessment?',
        answer:
          'Yes. With your permission, we may ask your child’s nursery or school to share what they’ve noticed about how your child communicates, joins in and manages everyday routines. This helps us understand their experiences across home and education settings. If your child is home educated, we can discuss what other information might help.',
      },
      {
        question: 'Will I receive a written report?',
        answer: 'Yes. After the feedback session you’ll receive a written report explaining the findings and practical recommendations for home and school.',
      },
    ],
    cta: 'View All FAQ’s',
  },
  closing: {
    title: 'Every child deserves to be\nunderstood.',
    body: 'Help your child access the understanding and support they need to flourish.',
    primaryCta: 'Book an Assessment',
    secondaryCta: 'Speak to a Specialist',
    strokeLeft: 'lavender',
    strokeRight: 'lavender',
  },
};

export const DEFAULT_ADULT_AUTISM: AssessmentPageContent = {
  label: 'Adult Autism Assessments',
  hero: hero(
    'cutout',
    'Understanding yourself\nstarts with understanding\nyour experiences.',
    'For many adults, seeking an Autism assessment follows years of feeling different, misunderstood or exhausted from trying to fit into environments not designed with them in mind. Our team helps you find answers with compassion, respect and clinical expertise.',
    photo('/images/assessments/adults/autism/hero.webp', 'A laughing woman wearing glasses and a colourful cardigan', 1300, 1950)
  ),
  callout: callout(
    'purple',
    'Could an assessment help?',
    'You may feel socially exhausted, prefer routine, experience sensory sensitivities, find change difficult, have intense interests, feel misunderstood or mask behaviours in social situations.'
  ),
  process: process(
    ['Initial consultation', 'Developmental history and questionnaires', 'Clinical assessment using recognised tools', 'Feedback session', 'Detailed report and practical recommendations'],
    ['purple', 'violet', 'coral', 'salmon', 'pink']
  ),
  why: why('Experienced Autism specialists, person-centred and neuro-affirming practice, evidence-based assessment and support after diagnosis.', null),
  included: included('Clinical interviews, relevant questionnaires, developmental information, assessment tools, feedback, report and tailored next steps.'),
  faq: {
    tone: 'lavender',
    title: 'Frequently Asked Questions',
    items: [
      {
        question: 'Can autism be diagnosed in adulthood?',
        answer:
          'Yes. You can be assessed and diagnosed as an adult, even if autism wasn’t picked up when you were younger. An assessment is a chance to talk about your experiences growing up and what everyday life is like for you now.',
      },
      {
        question: 'Will I receive a written report?',
        answer: 'Yes. You’ll receive a written report explaining the outcome of your assessment and tailored recommendations, and your clinician will talk it through with you.',
      },
    ],
    cta: 'View All FAQ’s',
  },
  closing: {
    title: 'Take the first step towards\nunderstanding yourself.',
    body: 'Begin your journey towards greater clarity, confidence and personalised support.',
    primaryCta: 'Book an Assessment',
    secondaryCta: 'Speak to a Specialist',
    strokeLeft: 'coral',
    strokeRight: 'coral',
  },
};

export const DEFAULT_CHILD_ADHD: AssessmentPageContent = {
  label: 'Child ADHD Assessments',
  hero: hero(
    'cutout',
    'Helping children thrive\nthrough understanding.',
    'If your child is struggling with attention, concentration, impulsivity or emotional regulation, it is natural to have questions.\n\nOur Child ADHD assessments help families understand their child’s needs and access practical support.',
    photo('/images/assessments/children/adhd/hero.webp', 'A smiling girl in a green jumper', 1800, 1327)
  ),
  callout: callout(
    'violet',
    'When might an assessment help?',
    'Families may notice difficulty focusing in class, hyperactivity, impulsivity, following instructions, emotional outbursts, friendship difficulties, poor organisation or challenges completing schoolwork.'
  ),
  process: process(
    [
      'Parent Consultation',
      'Developmental History',
      'Standardised Questionnaires',
      'Clinical Assessment & school information where appropriate',
      'Feedback appointment',
      'Written report and recommendations for home and education',
    ],
    ['coral', 'purple', 'lavender', 'lavender', 'pink', 'violet']
  ),
  why: why(
    'Child-centred care, collaborative family involvement, clear reporting and practical recommendations.',
    photo('/images/assessments/children/adhd/why.webp', 'A boy writing in a folder during a session', 1500, 1290)
  ),
  included: included(
    'Initial consultation, comprehensive assessment, standardised tools, detailed report, feedback appointment, practical recommendations, signposting and reasonable-adjustment guidance where appropriate.'
  ),
  faq: {
    tone: 'pink',
    title: 'Frequently Asked Questions',
    items: [
      {
        question: 'Can my child be assessed for ADHD?',
        answer:
          'Yes. If difficulties with attention, activity levels or impulsivity are affecting your child’s everyday life, a specialist assessment can help you understand what’s behind them.',
      },
      {
        question: 'How long does a children’s ADHD assessment take?',
        answer: 'It depends on your child and the information we need. We’ll explain the steps and the likely timescale when you book, and keep you updated throughout.',
      },
    ],
    cta: 'View All FAQ’s',
  },
  closing: {
    title: 'Give your child the\nunderstanding they deserve.',
    body: 'Take the next step towards personalised support and positive outcomes.',
    primaryCta: 'Book an Assessment',
    secondaryCta: 'Speak to a Specialist',
    strokeLeft: 'violet',
    strokeRight: 'violet',
  },
};

export const DEFAULT_ADULT_ADHD: AssessmentPageContent = {
  label: 'Adult ADHD Assessments',
  hero: hero(
    'cutout',
    'Understand yourself\nwith confidence.',
    'If you’ve spent years wondering why everyday tasks feel harder than they should, you’re not alone. Many adults seek an ADHD assessment after recognising lifelong patterns with attention, organisation, impulsivity or emotional regulation.\n\nOur assessments provide clarity through a compassionate, evidence-based approach.',
    photo('/images/assessments/adults/adhd/hero.webp', 'A laughing woman in a teal cardigan', 1400, 1596)
  ),
  callout: callout(
    'coral',
    'Could ADHD explain what you’re\nexperiencing?',
    'Difficulty concentrating, forgetfulness, disorganisation, restlessness, time-management difficulties, unfinished tasks, emotional overwhelm, impulsive decisions or challenges balancing work, study and relationships may lead someone to explore an assessment.'
  ),
  process: process(
    [
      'Initial consultation',
      'Information gathering and questionnaires',
      'Review of developmental history',
      'Comprehensive clinical assessment',
      'Assessment outcome and written report',
      'Practical next steps and ongoing support',
    ],
    ['purple', 'violet', 'lavender', 'lavender', 'pink', 'coral']
  ),
  why: why(
    'Experienced clinicians, person-centred assessments, evidence-based practice and support beyond diagnosis.',
    photo('/images/assessments/adults/adhd/why.webp', 'A woman going through a form on a tablet with a clinician', 1500, 1290)
  ),
  included: included(
    'Initial consultation, comprehensive assessment, standardised tools, detailed report, feedback appointment, practical recommendations, signposting and reasonable-adjustment guidance where appropriate.'
  ),
  faq: {
    tone: 'coralSoft',
    title: 'Frequently Asked Questions',
    items: [
      {
        question: 'Can ADHD be diagnosed in adulthood?',
        answer:
          'Yes. Many people first explore whether they have ADHD as adults. As part of your assessment, your clinician will ask about your experiences growing up and how your symptoms affect everyday life now.',
      },
      {
        question: 'Can I have ADHD if I’m not hyperactive?',
        answer: 'Yes. ADHD doesn’t always look like hyperactivity. Many adults mainly experience difficulties with attention, organisation or restlessness that others don’t see.',
      },
    ],
    cta: 'View All FAQ’s',
  },
  closing: {
    title: 'Take the first step towards\nunderstanding yourself.',
    body: 'Begin your journey towards greater clarity, confidence and personalised support.',
    primaryCta: 'Book an Assessment',
    secondaryCta: 'Speak to a Specialist',
    strokeLeft: 'violet',
    strokeRight: 'violet',
  },
};

// ── Adult and children hubs ────────────────────────────────────────────────

export interface AssessmentHubContent {
  label: string;
  hero: {
    /** `light`: a frosted white panel with purple text. `purple`: a frosted purple panel with white text. */
    tone: 'light' | 'purple';
    title: string;
    body: string;
    image: Photo | null;
    primaryCta: string;
    secondaryCta: string;
  };
  cards: { tone: 'pink' | 'coral'; items: AssessmentCard[] };
  /** The line under the cards. */
  tagline: string;
  closing: { title: string; body: string; primaryCta: string; secondaryCta: string };
}

const HYBRID_CARD: AssessmentCard = {
  title: 'Hybrid ADHD\nand Autism\nAssessment',
  body: 'Explore ADHD and autism together in one assessment, with an integrated report and practical recommendations. Available for adults and children.',
  href: ROUTES.combinedAssessment,
};

const CARDS = {
  childAdhd: {
    title: 'Child ADHD\nAssessments',
    body: 'Explore how your child’s attention, activity and impulsivity show up in everyday life, including at home and at school.',
    href: ROUTES.childAdhd,
  },
  childAutism: {
    title: 'Child Autism\nAssessments',
    body: 'Build a clearer picture of how your child communicates, interacts and experiences the world around them.',
    href: ROUTES.childAutism,
  },
  adultAdhd: {
    title: 'Adult ADHD\nAssessments',
    body: 'Explore whether ADHD could help explain longstanding patterns with attention, organisation or impulsivity.',
    href: ROUTES.adultAdhd,
  },
  adultAutism: {
    title: 'Adult Autism\nAssessments',
    body: 'Explore your experiences of communication, social situations, routines and sensory differences.',
    href: ROUTES.adultAutism,
  },
} satisfies Record<string, AssessmentCard>;

const HUB_CLOSING_BODY = 'Begin with a conversation with our team.\nChat to one of our clinicians or book an assessment.';

export const DEFAULT_CHILDREN_HUB: AssessmentHubContent = {
  label: 'Children Assessments',
  hero: {
    tone: 'light',
    title: 'Helping children reach their\npotential.',
    body: 'Our child assessment services give families clear answers, practical recommendations and ongoing support that helps children thrive.',
    image: photo('/images/assessments/children/hero.webp', 'A group of smiling children looking down at the camera', 2560, 1136),
    primaryCta: 'Book an Assessment',
    secondaryCta: 'Speak to a Specialist',
  },
  cards: { tone: 'pink', items: [CARDS.childAdhd, CARDS.childAutism, HYBRID_CARD] },
  tagline: 'Child ADHD, Child Autism, Combined Assessments, Parent Support, School Guidance and support after diagnosis.',
  closing: { title: 'Understanding today.\nConfidence for tomorrow.', body: HUB_CLOSING_BODY, primaryCta: 'Book an Assessment', secondaryCta: 'Contact Us' },
};

export const DEFAULT_ADULTS_HUB: AssessmentHubContent = {
  label: 'Adult Assessments',
  hero: {
    tone: 'purple',
    title: 'Understanding yourself starts here',
    body: 'Many adults spend years masking their experiences or wondering why life feels more challenging. Our adult pathways provide clarity through compassionate, evidence-based care.',
    image: photo('/images/assessments/adults/hero.webp', 'A group of smiling adults leaning in together', 2560, 1134),
    primaryCta: 'Book an Assessment',
    secondaryCta: 'Speak to a Specialist',
  },
  cards: { tone: 'coral', items: [CARDS.adultAdhd, CARDS.adultAutism, HYBRID_CARD] },
  tagline: 'Adult ADHD, Adult Autism, Combined ADHD & Autism, cognitive assessment and support after diagnosis.',
  closing: { title: 'It’s never too late to\nunderstand yourself.', body: HUB_CLOSING_BODY, primaryCta: 'Book an Assessment', secondaryCta: 'Contact Us' },
};

// ── Overview (/assessments) ────────────────────────────────────────────────

export interface AssessmentsOverviewContent {
  label: string;
  hero: { title: string; body: string; image: Photo | null; primaryCta: string; secondaryCta: string };
  finder: { title: string; body: string; adultCta: string; childCta: string };
  cards: AssessmentCard[];
  during: { title: string; steps: { title: string; body: string }[] };
  unsure: { title: string; body: string; primaryCta: string; secondaryCta: string };
  professionals: { title: string; body: string; cta: string };
}

export const DEFAULT_ASSESSMENTS_OVERVIEW: AssessmentsOverviewContent = {
  label: 'Assessments',
  hero: {
    title: 'Find the right ADHD or\nautism assessment',
    body: 'If you’re exploring ADHD or autism for yourself or your child, it can be hard to know where to start. Nurova Minds offers assessments for adults and children. We’ll talk through what brought you to us, explain what the findings mean and share practical next steps.',
    image: photo('/images/assessments/overview/hero.webp', 'A thoughtful girl resting her chin on her hand', 1500, 1477),
    primaryCta: 'Explore Assessments',
    secondaryCta: 'Speak to a Specialist',
  },
  finder: {
    title: 'Find the right assessment',
    body: 'Start with what you’d like to explore, then choose the option for yourself or your child.\nIf you’d like both ADHD and autism considered together, explore our combined assessment.',
    adultCta: 'Adult Assessments',
    childCta: 'Child Assessments',
  },
  cards: [CARDS.adultAdhd, CARDS.childAdhd, CARDS.adultAutism, CARDS.childAutism, HYBRID_CARD],
  during: {
    title: 'What happens during an assessment?',
    steps: [
      { title: 'We listen\nto your\nexperiences.', body: 'We start by getting to know you or your child and understanding what led you to seek an assessment.' },
      { title: 'We talk\nthrough the\nresults.', body: 'Your clinician explains what the findings mean and gives you time to ask questions.' },
      { title: 'We share\npractical next\nsteps.', body: 'You’ll receive a written report and recommendations based on the findings.' },
    ],
  },
  unsure: {
    title: 'Unsure which assessment to choose?',
    body: 'Tell us what you’ve noticed and what you’d like to understand.\nWe can talk through the options with you before you book.',
    primaryCta: 'Speak to a Specialist',
    secondaryCta: 'Contact Us',
  },
  professionals: {
    title: 'For schools, NHS teams and commissioners',
    body: 'If you’re enquiring about assessment services for your organisation or the people you support, use our Professional enquiries route.',
    cta: 'Professional Enquiries',
  },
};
