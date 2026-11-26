/**
 * The FAQs page (/resources/faqs): questions filed under categories, shown
 * one category at a time. Defaults are starter copy for the client to review.
 */
import type { StrokeTone } from './assessments';

export interface FaqEntry {
  question: string;
  answer: string;
  /** Category names this question is listed under (must match names in `categories`). */
  categories: string[];
}

export interface FaqPageContent {
  /** The coral label above the heading. */
  label: string;
  title: string;
  /** The filter buttons, in order. */
  categories: string[];
  /** The last button, which shows every question. */
  allLabel: string;
  /** Shown when a category has no questions yet. */
  emptyText: string;
  items: FaqEntry[];
  closing: { title: string; body: string; primaryCta: string; secondaryCta: string; strokeLeft: StrokeTone; strokeRight: StrokeTone };
}

const faq = (categories: string[], question: string, answer: string): FaqEntry => ({ question, answer, categories });

export const DEFAULT_FAQS: FaqPageContent = {
  label: 'FAQ’s',
  title: 'Frequently Asked Questions',
  categories: [
    'General',
    'ADHD',
    'Autism',
    'Adults',
    'Children',
    'AuDHD',
    'Right to Choose',
    'Assessments',
    'Referrals',
    'Treatment',
    'Support',
    'Professionals',
    'Data Protection',
    'Bookings',
    'Payment',
    'Governance',
  ],
  allLabel: 'All',
  emptyText: 'There are no questions in this category yet. Please get in touch and we’ll be happy to help.',
  items: [
    // General
    faq(
      ['General'],
      'Who is Nurova Minds for?',
      'Nurova Minds offers neurodevelopmental assessments and support for children, young people and adults, including ADHD, autism and combined ADHD and autism assessments.'
    ),
    faq(
      ['General', 'Bookings'],
      'Are appointments available online?',
      'Many appointments can take place online. We’ll talk you through which parts of your assessment can be done remotely when you get in touch.'
    ),
    faq(
      ['General', 'Assessments'],
      'How long does the assessment process take?',
      'It depends on the assessment and the information we need. We’ll explain the steps and the likely timescale when you book, and keep you updated throughout.'
    ),
    // ADHD
    faq(
      ['ADHD', 'Adults'],
      'Can ADHD be diagnosed in adulthood?',
      'Yes. Many people first explore whether they have ADHD as adults. As part of your assessment, your clinician will ask about your experiences growing up and how your symptoms affect everyday life now.'
    ),
    faq(
      ['ADHD', 'Adults'],
      'Can I have ADHD if I’m not hyperactive?',
      'Yes. ADHD doesn’t always look like hyperactivity. Many adults mainly experience difficulties with attention, organisation or restlessness that others don’t see.'
    ),
    faq(
      ['ADHD', 'Children'],
      'Can my child be assessed for ADHD?',
      'Yes. If difficulties with attention, activity levels or impulsivity are affecting your child’s everyday life, a specialist assessment can help you understand what’s behind them.'
    ),
    // Autism
    faq(
      ['Autism', 'Adults'],
      'Can autism be diagnosed in adulthood?',
      'Yes. You can be assessed and diagnosed as an adult, even if autism wasn’t picked up when you were younger. An assessment is a chance to talk about your experiences growing up and what everyday life is like for you now.'
    ),
    faq(
      ['Autism', 'Children'],
      'Can my child’s school contribute to the assessment?',
      'Yes. With your permission, we may ask your child’s nursery or school to share what they’ve noticed about how your child communicates, joins in and manages everyday routines. This helps us understand their experiences across home and education settings.'
    ),
    // AuDHD
    faq(
      ['AuDHD', 'Assessments'],
      'Can a combined assessment lead to a diagnosis of both ADHD and autism?',
      'Yes. The outcome may be an ADHD diagnosis, an autism diagnosis, both diagnoses or neither. Your clinician will explain the findings and how they reached their conclusions.'
    ),
    faq(
      ['AuDHD'],
      'Can I have a combined assessment if I’m unsure whether it’s ADHD or autism?',
      'Yes. A combined assessment is designed for exactly this. We look at both together, so you don’t need to know which it might be before you book.'
    ),
    // Right to Choose
    faq(
      ['Right to Choose'],
      'Does Right to Choose guarantee an assessment?',
      'No. Right to Choose lets eligible patients in England choose a provider for an NHS-funded ADHD or autism assessment if their GP determines that a referral is clinically appropriate. The provider must hold a qualifying NHS contract for the assessment you need.'
    ),
    faq(
      ['Right to Choose', 'Referrals'],
      'Can my GP refer me?',
      'If you’re registered with a GP practice in England and your GP agrees that an ADHD or autism assessment is clinically appropriate, they can refer you to Nurova Minds under Right to Choose. We can send you guidance to share with your GP.'
    ),
    faq(
      ['Right to Choose'],
      'Do you offer Right to Choose assessments?',
      'Yes, for eligible patients in England. Get in touch and we’ll explain the referral requirements and next steps.'
    ),
    // Assessments
    faq(
      ['Assessments'],
      'Will I receive a written report?',
      'Yes. You’ll receive a written report explaining the outcome of your assessment and tailored recommendations, and your clinician will talk it through with you.'
    ),
    faq(['Assessments', 'Adults', 'Children'], 'Are assessments available for adults and children?', 'Yes. We assess children, young people and adults.'),
    // Referrals
    faq(
      ['Referrals'],
      'Do I need a referral to book an assessment?',
      'You don’t need a referral to book a private assessment. For an NHS-funded assessment under Right to Choose, you’ll need a referral from your GP.'
    ),
    // Treatment
    faq(
      ['Treatment', 'Support'],
      'What happens after diagnosis?',
      'Your clinician will talk you through the findings and recommendations. Support may include ADHD coaching, autism support, parent guidance, workplace and school recommendations, therapy, medication pathways, ongoing reviews and signposting.'
    ),
    faq(
      ['Treatment', 'ADHD'],
      'Can you prescribe ADHD medication?',
      'Medication may be one option after an ADHD diagnosis. Your clinician will explain whether a medication pathway is suitable for you and how it works.'
    ),
    // Support
    faq(
      ['Support', 'Children'],
      'Do you offer support for parents?',
      'Yes. We offer parent guidance to help you understand your child’s needs and how to support them at home and at school.'
    ),
    // Professionals
    faq(
      ['Professionals'],
      'Can schools, employers or local authorities work with you?',
      'Yes. We work with schools, employers, NHS teams and commissioners. Visit our For Professionals page or contact us to discuss what you need.'
    ),
    // Data Protection
    faq(
      ['Data Protection'],
      'How do you look after my personal information?',
      'We handle your information in line with UK data protection law and only use it to provide your care. Our privacy policy explains what we collect, why and how long we keep it.'
    ),
    faq(['Data Protection'], 'Can I withdraw my consent?', 'Yes. You can withdraw consent you’ve given us at any time using our Revoke Consents page or by contacting us.'),
    // Bookings
    faq(
      ['Bookings'],
      'How do I book an assessment?',
      'Use the Book an Assessment button or contact our team. We’ll help you choose the right assessment and explain what happens next.'
    ),
    // Payment
    faq(['Payment'], 'How much does an assessment cost?', 'Costs depend on the assessment. We’ll confirm the price and what’s included before you book.'),
    // Governance
    faq(
      ['Governance'],
      'How do you maintain clinical quality?',
      'Our assessments are led by experienced clinicians and follow our clinical governance and quality standards. You can read more on our Quality & Clinical Standards page.'
    ),
  ],
  closing: {
    title: 'Helping individuals build\nconfidence every day.',
    body: 'Explore assessment and support options with Nurova Minds.\nChat to one of our clinicians or book an assessment.',
    primaryCta: 'Book an Assessment',
    secondaryCta: 'Contact Us',
    strokeLeft: 'lavender',
    strokeRight: 'pink',
  },
};
