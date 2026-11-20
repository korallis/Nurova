/**
 * Content types for the single pages and their built-in defaults. Defaults
 * are the copy the site shipped with; they're used until a document is saved
 * in the dashboard, and seeded into the database by `bun run db:seed`.
 *
 * In headings, a line break ("\n") becomes a line break on larger screens.
 */
import { ROUTES } from '@/constants';
import type { Photo } from './fields';

// ── Site settings ──────────────────────────────────────────────────────────

export interface SettingsContent {
  siteName: string;
  /** Shown under the logo and in browser tabs after the site name. */
  tagline: string;
  /** Default meta description for search engines. */
  description: string;
  contact: {
    /** Shown to visitors when a form can't be sent. */
    enquiriesEmail: string;
    /** As shown in the footer. */
    phone: string;
    /** International format used for tap-to-call links. */
    phoneInternational: string;
  };
  /** The office shown in the footer. */
  address: { heading: string; lines: string[] };
  /** Leave a link empty until the account exists; its icon still shows. */
  socials: { linkedin: string; instagram: string; facebook: string };
  /** After "© <year> <site name>" in the footer. */
  footerCredit: string;
  comingSoon: {
    title: string;
    intro: string;
    /** The button that scrolls down to the form. */
    ctaLabel: string;
    formHeading: string;
    submitLabel: string;
  };
  /** Shown in place of the coming-soon page once an enquiry is sent. */
  enquirySent: {
    heading: string;
    body: string;
    subscribeLabel: string;
    /** Shown after someone subscribes. */
    subscribedMessage: string;
  };
}

export const DEFAULT_SETTINGS: SettingsContent = {
  siteName: 'Nurova Minds',
  tagline: 'Understanding Minds. Transforming Lives.',
  description: 'Nurova Minds: ADHD and autism assessments and support for children, young people and adults. Understanding minds, transforming lives.',
  contact: {
    enquiriesEmail: '',
    phone: '08081754091',
    phoneInternational: '+44 808 175 4091',
  },
  address: { heading: 'Head Office', lines: ['Suite 1, Aqueous II, Rocky Lane, Birmingham, B6 5RQ'] },
  socials: { linkedin: '', instagram: '', facebook: '' },
  footerCredit: 'All Rights Reserved. Site by Marva Group.',
  comingSoon: {
    title: 'We’re Launching Very Soon.',
    intro:
      'If you’re exploring an ADHD or autism assessment for yourself or someone you support, or you’d like to discuss professional referral pathways, we’d love to hear from you.',
    ctaLabel: 'Get in touch',
    formHeading: 'Get in touch',
    submitLabel: 'Send enquiry',
  },
  enquirySent: {
    heading: 'We’ll be in touch with you soon!',
    body: 'Thank you for getting in touch with Nurova Minds. We’ve received your enquiry and will email you about the next steps.',
    subscribeLabel: 'Subscribe',
    subscribedMessage: 'Thanks for subscribing! We’ll keep you posted.',
  },
};

// ── Home ───────────────────────────────────────────────────────────────────

/** A card in the assessments carousel. */
export interface AssessmentCard {
  title: string;
  body: string;
  /** Where "Learn More" goes. */
  href: string;
}

export interface HomeContent {
  hero: {
    title: string;
    body: string;
    /** A cut-out photo (transparent background) standing on the bottom of the card; its head can rise above it. */
    image: Photo | null;
    primaryCta: string;
    secondaryCta: string;
  };
  quote: { text: string; body: string; cta: string };
  assessments: AssessmentCard[];
  whyChoose: { title: string; body: string; cta: string };
  journey: { title: string; steps: string[]; image: Photo | null; cta: string; linkLabel: string };
  help: {
    title: string;
    subtitle: string;
    body: string;
    /** A cut-out photo (transparent background) on the right of the card. */
    image: Photo | null;
    primaryCta: string;
    secondaryCta: string;
  };
  afterAssessment: { title: string; body: string; cta: string };
  faq: { title: string; body: string; cta: string };
  closing: { title: string; body: string; primaryCta: string; secondaryCta: string };
}

export const DEFAULT_HOME: HomeContent = {
  hero: {
    title: 'Clarity starts here.',
    body:
      'Looking for an ADHD or autism assessment for yourself or someone you support? Nurova Minds assesses children, young people and adults. We explain what happens at each step and help you understand your options after the assessment.',
    image: { src: '/images/home-hero.png', alt: 'A young man with curly hair, laughing', width: 820, height: 731 },
    primaryCta: 'Book an Assessment',
    secondaryCta: 'For Professionals',
  },
  quote: {
    text: '“Understanding\nis more than a\ndiagnosis”',
    body:
      'You might have questions about how you or your child thinks, learns or manages everyday tasks. An assessment can help you understand those experiences and what support could help.',
    cta: 'Book an Assessment',
  },
  assessments: [
    {
      title: 'ADHD\nAssessments',
      body: 'Comprehensive assessments for children, young people and adults delivered by experienced clinicians using evidence-based diagnostic frameworks.',
      href: ROUTES.adhdAssessment,
    },
    {
      title: 'Autism\nAssessments',
      body: 'Thoughtful, person-centred Autism assessments that recognise every individual’s unique strengths, experiences and support needs.',
      href: ROUTES.autismAssessment,
    },
    {
      title: 'Hybrid\nADHD & Autism\nAssessments',
      body: 'A holistic evaluation where appropriate, reducing duplication and creating a clearer understanding of your needs.',
      href: ROUTES.combinedAssessment,
    },
    {
      title: 'Right to\nChoose',
      body: 'If you’re registered with a GP in England, you may be able to choose where you have an NHS ADHD or autism assessment. Find out how Right to Choose works.',
      href: ROUTES.rightToChoose,
    },
    {
      title: 'Support After\nDiagnosis',
      body: 'Practical support after your assessment, from ADHD coaching and parent guidance to school and workplace recommendations.',
      href: ROUTES.support,
    },
  ],
  whyChoose: {
    title: 'Why families and individuals choose\nNurova Minds',
    body:
      'Tell us what would help you take part. We offer different ways to communicate, clear information and spaces that take sensory needs into account. You can ask for reasonable adjustments at any stage of your assessment.',
    cta: 'Book an Assessment',
  },
  journey: {
    title: 'Our Assessment\nJourney',
    steps: [
      'Choose an assessment for yourself or someone you support.',
      'Book online.',
      'Tell us about your needs before the assessment.',
      'Meet your clinician.',
      'Get feedback and practical next steps.',
    ],
    image: { src: '/images/home-journey.png', alt: 'A mother and two children playing with a wooden puzzle on the sofa', width: 932, height: 749 },
    cta: 'Book an Assessment',
    linkLabel: 'Learn More',
  },
  help: {
    title: 'How can we help?',
    subtitle: 'Paying for an assessment?',
    body:
      'You can book online for yourself or someone you support. Working for an NHS trust or integrated care board? Visit our professionals page to discuss assessment pathways.',
    image: { src: '/images/home-help.png', alt: 'A smiling young woman in a yellow beanie, resting her chin on her hands', width: 788, height: 548 },
    primaryCta: 'Book an Assessment',
    secondaryCta: 'For Professionals',
  },
  afterAssessment: {
    title: 'More Than An\nAssessment',
    body:
      'Following assessment, support may include ADHD coaching, Autism support, parent guidance, workplace and school recommendations, therapy, medication pathways, ongoing reviews and signposting.',
    cta: 'Book an Assessment',
  },
  faq: {
    title: 'Frequently asked\nquestions',
    body:
      'How long does the assessment process take?\nAre assessments available for adults and children?\nAre appointments available online? What happens after diagnosis? Do you offer Right to Choose assessments?',
    cta: 'Read More',
  },
  closing: {
    title: 'Your journey to understanding\nstarts here.',
    body: 'Whether you’re seeking answers for yourself, your child or someone you support, our team is here to help.',
    primaryCta: 'Book an Assessment',
    secondaryCta: 'Speak to a Specialist',
  },
};

// ── About ──────────────────────────────────────────────────────────────────

/** A card under "Our purpose, ambitions and values". */
export interface AboutPillar {
  title: string;
  body: string;
  /** A cut-out photo (transparent background) standing in the bottom-right corner. */
  image: Photo | null;
}

/** A person in the "Meet the team" carousel. */
export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: Photo | null;
}

export interface AboutContent {
  hero: {
    /** The coral label above the card. */
    label: string;
    title: string;
    body: string;
    /** A cut-out photo standing on the bottom of the card on the right; its head can rise above it. */
    image: Photo | null;
    primaryCta: string;
    secondaryCta: string;
  };
  purpose: { title: string; body: string; cta: string };
  pillars: AboutPillar[];
  team: { members: TeamMember[]; cta: string; nextLabel: string };
  closing: { title: string; body: string; primaryCta: string; secondaryCta: string };
}

export const DEFAULT_ABOUT: AboutContent = {
  hero: {
    label: 'About Nurova Minds',
    title: 'We’re here to help people\nunderstand themselves.',
    body:
      'Nurova Minds exists to provide compassionate, evidence-based neurodevelopmental assessments and ongoing support that empowers people to move forward with confidence.',
    image: { src: '/images/about-hero.png', alt: 'A smiling woman in a pink jumper, pointing', width: 1023, height: 796 },
    primaryCta: 'Book an Assessment',
    secondaryCta: 'Contact Us',
  },
  purpose: {
    title: 'Our purpose, ambitions\nand values',
    body: 'We make high-quality assessments easier to access so you can better understand your needs and take the next step towards support that works for you.',
    cta: 'Our Approach',
  },
  pillars: [
    { title: 'Our\nmission', body: 'is to make\nhigh-quality\nassessments\neasier to\naccess.', image: { src: '/images/about-mission.png', alt: 'A smiling young man making an OK sign', width: 472, height: 528 } },
    { title: 'Our\nvision', body: 'is for people to\ngain a clearer\nunderstanding of\ntheir needs and\nget the right\nsupport when\nthey need it.', image: { src: '/images/about-vision.png', alt: 'A laughing woman holding her glasses', width: 472, height: 528 } },
    { title: 'Our\nvalues', body: 'are compassion,\nclarity, excellence,\ncollaboration and\nempowerment.', image: { src: '/images/about-values.png', alt: 'A smiling man making a heart shape with his hands', width: 472, height: 528 } },
  ],
  team: {
    members: [
      {
        name: 'Dr. Natalie Gillbanks',
        role: 'Clinical Director, Nurova',
        bio:
          'Natalie is a Consultant Counselling Psychologist with experience supporting neurodivergent people and people with complex mental health needs. She brings clinical expertise into how we design and deliver services at Nurova Minds, with a focus on making care evidence-based, compassionate and responsive to what each person needs.',
        image: { src: '/images/team-natalie-gillbanks.png', alt: 'Dr. Natalie Gillbanks', width: 763, height: 751 },
      },
      {
        name: 'James Bent',
        role: 'Clinical Recruiter, Nurova',
        bio:
          'James brings over a decade of healthcare recruitment experience to Nurova Minds, including nearly eight years as a Recruitment Manager. He now focuses on connecting clinicians with opportunities in ADHD, autism and wider neurodevelopmental services.\nJames helps build the clinical teams behind our assessments, bringing in people with the right expertise to support individuals and families seeking answers.',
        image: { src: '/images/team-james-bent.png', alt: 'James Bent', width: 763, height: 751 },
      },
      {
        name: 'Ian Southerland',
        role: 'Managing Director, Nurova',
        bio:
          'Ian leads Nurova Minds and brings more than 11 years of healthcare leadership experience from Bupa UK. As Operations Director, he led primary care and mental health services across 120 clinics.\nAt Nurova Minds, Ian draws on that experience to shape how our services develop and grow, with a focus on making high-quality assessments easier to access so people can get the answers and support they need sooner.',
        image: { src: '/images/team-ian-southerland.png', alt: 'Ian Southerland', width: 763, height: 751 },
      },
    ],
    cta: 'Meet the Team',
    nextLabel: 'Next',
  },
  closing: {
    title: 'Ready to take\nthe next step?',
    body: 'Contact Nurova Minds for guidance and support.',
    primaryCta: 'Book an Assessment',
    secondaryCta: 'Contact Us',
  },
};
