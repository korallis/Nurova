/**
 * The Right to Choose page (/right-to-choose). Defaults are the copy from the design.
 */
import type { FaqTone, StrokeTone } from './assessments';
import type { Photo } from './fields';

export interface RightToChooseContent {
  /** The coral label above the hero. */
  label: string;
  hero: {
    title: string;
    body: string;
    /** A cut-out standing on the right of the gradient card. */
    image: Photo | null;
    primaryCta: string;
    secondaryCta: string;
  };
  /** "What is Right to Choose?": centred heading, text and two buttons. */
  intro: {
    title: string;
    body: string;
    primaryCta: string;
    secondaryCta: string;
  };
  /** The white, violet-edged card on the left. */
  who: { title: string; body: string; cta: string };
  /** The violet card on the right: a numbered list. */
  process: { title: string; steps: string[]; cta: string };
  /** "What happens when we check eligibility?": three coral cards. */
  checks: { title: string; steps: { title: string; body: string }[] };
  faq: {
    tone: FaqTone;
    title: string;
    items: { question: string; answer: string }[];
    cta: string;
  };
  closing: {
    title: string;
    body: string;
    primaryCta: string;
    secondaryCta: string;
    strokeLeft: StrokeTone;
    strokeRight: StrokeTone;
  };
}

export const DEFAULT_RIGHT_TO_CHOOSE: RightToChooseContent = {
  label: 'Right to Choose',
  hero: {
    title: 'Access the assessment\nyou need, sooner.',
    body: 'If you’re eligible for NHS Right to Choose, you may be able to select your assessment provider rather than remaining solely on your local pathway. Nurova Minds will explain the process, referral requirements and next steps.',
    image: {
      src: '/images/right-to-choose/hero.webp',
      alt: 'A man resting his chin on his hand, looking up thoughtfully',
      width: 761,
      height: 683,
    },
    primaryCta: 'Check Your Eligibility',
    secondaryCta: 'Speak to Our Team',
  },
  intro: {
    title: 'What is Right to Choose?',
    body: 'The pathway may allow eligible patients in England to choose a provider for certain NHS services.\nGP agreement, eligibility and commissioning arrangements apply.',
    primaryCta: 'Check Your Eligibility',
    secondaryCta: 'Speak to Our Team',
  },
  who: {
    title: 'Who can use Right\nto Choose?',
    body: 'People living in England, registered with a GP in England and requiring an eligible ADHD or Autism assessment may be able to use the pathway.',
    cta: 'Speak to a Specialist',
  },
  process: {
    title: 'How the process works',
    steps: [
      'Contact Nurova Minds.',
      'Receive referral guidance and supporting documents.',
      'Discuss referral with your GP.',
      'Referral reviewed and accepted where criteria are met.',
      'Complete assessment and receive recommendations.',
    ],
    cta: 'Check Eligibility',
  },
  checks: {
    title: 'What happens when we check eligibility?',
    steps: [
      {
        title: 'Check\nyour GP\nregistration',
        body: 'We confirm that you’re registered with a GP practice in England.',
      },
      {
        title: 'Review your\nreferral',
        body: 'Your GP decides whether an ADHD or autism assessment is clinically appropriate. Once we receive your referral, we check whether it meets the criteria for our NHS Right to Choose pathway.',
      },
      {
        title: 'Explain what\nhappens next',
        body: 'We let you know the outcome and what to expect. If we need more information, we’ll explain what’s missing and how to provide it.',
      },
    ],
  },
  faq: {
    tone: 'coral',
    title: 'Frequently Asked Questions',
    items: [
      {
        question: 'Does Right to Choose guarantee an assessment?',
        answer:
          'No. Right to Choose lets eligible patients in England choose a provider for an NHS-funded ADHD or autism assessment if their GP determines that a referral is clinically appropriate. The provider must hold a qualifying NHS contract for the assessment you need.',
      },
      {
        question: 'Can my GP refer me?',
        answer:
          'If you’re registered with a GP practice in England and your GP agrees that an ADHD or autism assessment is clinically appropriate, they can refer you to Nurova Minds under Right to Choose. We can send you guidance to share with your GP.',
      },
    ],
    cta: 'View All FAQ’s',
  },
  closing: {
    title: 'Ready to explore\nyour options?',
    body: 'Speak with our team to understand\nwhether this is an appropriate pathway.',
    primaryCta: 'Check Eligibility',
    secondaryCta: 'Speak to a Specialist',
    strokeLeft: 'pink',
    strokeRight: 'lavender',
  },
};
