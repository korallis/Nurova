/** Editor schemas for the assessment pages (lib/content/assessments.ts). */
import { CALLOUT_TONES, FAQ_TONES, STEP_TONES, STROKE_TONES } from './assessments';
import { CONDITION_CARD_TONES, CONDITION_HERO_TONES } from './conditions';
import { list, object, optional, photo, select, text, textarea, type Field } from './fields';

const heading = (label = 'Heading') => textarea(label, { rows: 2, help: 'A line break starts a new line on larger screens.' });
const body = (label = 'Text') => textarea(label, { rows: 4 });
const lines = (label = 'Text') => textarea(label, { rows: 3, help: 'A line break starts a new line on larger screens.' });
const twoButtons = (first: string, second: string) => ({ primaryCta: text(`${first} button label`), secondaryCta: text(`${second} button label`) });

const cardSchema = object({ title: heading('Title'), body: body(), href: text('“Learn More” link', { placeholder: '/assessments/adults/adhd' }) });

export const assessmentPageSchema: Field = object({
  label: text('Label', { help: 'The coral label above the hero.' }),
  hero: object(
    {
      style: select('Style', { cutout: 'Cut-out photo on a white background', photo: 'Tinted photo filling the card' }),
      title: heading(),
      body: textarea('Text', { rows: 5, help: 'Leave a blank line between paragraphs.' }),
      image: optional('Photo', photo('Photo', 'For the cut-out style, use a PNG or WebP with a transparent background.')),
      ...twoButtons('Main', '“Speak to a Specialist”'),
    },
    'Hero'
  ),
  callout: object(
    { tone: select('Colour', CALLOUT_TONES), title: heading(), body: body(), ...twoButtons('Main', '“For Professionals”') },
    'Card under the hero'
  ),
  process: object(
    {
      title: text('Heading'),
      steps: list('Steps', object({ title: text('Step'), tone: select('Colour', STEP_TONES) }), { itemTitle: 'title', min: 1, help: 'Shown three to a row.' }),
    },
    'Our assessment process'
  ),
  why: object({ title: heading(), body: body(), image: optional('Photo', photo('Photo'), 'Shown on the right.'), cta: text('Button label') }, 'Why choose Nurova Minds'),
  included: object({ title: text('Heading'), body: body(), ...twoButtons('“Speak to a Specialist”', '“Contact Us”') }, 'What’s included'),
  faq: object(
    {
      tone: select('Colour', FAQ_TONES),
      title: text('Heading'),
      items: list('Questions', object({ question: text('Question'), answer: body('Answer') }), { itemTitle: 'question', help: 'The first question starts open.' }),
      cta: text('“View All FAQ’s” button label'),
    },
    'Frequently asked questions'
  ),
  closing: object(
    {
      title: heading(),
      body: body(),
      ...twoButtons('Main', 'Second'),
      strokeLeft: select('Left stroke colour', STROKE_TONES),
      strokeRight: select('Right stroke colour', STROKE_TONES),
    },
    'Closing call to action'
  ),
});

export const assessmentHubSchema: Field = object({
  label: text('Label', { help: 'The coral label above the hero.' }),
  hero: object(
    {
      tone: select('Panel', { light: 'Frosted white, purple text', purple: 'Frosted purple, white text' }),
      title: heading(),
      body: body(),
      image: optional('Photo', photo('Photo'), 'Fills the card behind the panel.'),
      ...twoButtons('Main', '“Speak to a Specialist”'),
    },
    'Hero'
  ),
  cards: object({ tone: select('Colour', { pink: 'Pink, purple text', coral: 'Coral, white text' }), items: list('Cards', cardSchema, { itemTitle: 'title', min: 1 }) }, 'Assessment cards'),
  tagline: textarea('Line under the cards', { rows: 2 }),
  closing: object({ title: heading(), body: lines(), ...twoButtons('Main', '“Contact Us”') }, 'Closing call to action'),
});

export const assessmentsOverviewSchema: Field = object({
  label: text('Label', { help: 'The coral label above the hero.' }),
  hero: object(
    {
      title: heading(),
      body: body(),
      image: optional('Photo', photo('Photo', 'Use a PNG or WebP with a transparent background.'), 'A cut-out photo on the right; its head can rise above the card.'),
      ...twoButtons('“Explore Assessments”', '“Speak to a Specialist”'),
    },
    'Hero'
  ),
  finder: object({ title: text('Heading'), body: lines(), adultCta: text('“Adult Assessments” button label'), childCta: text('“Child Assessments” button label') }, 'Find the right assessment'),
  cards: list('Assessment cards', cardSchema, { itemTitle: 'title', min: 1, help: 'The carousel under “Find the right assessment”.' }),
  during: object(
    { title: text('Heading'), steps: list('Cards', object({ title: heading('Title'), body: body() }), { itemTitle: 'title', min: 1 }) },
    'What happens during an assessment'
  ),
  unsure: object({ title: text('Heading'), body: lines(), ...twoButtons('“Speak to a Specialist”', '“Contact Us”') }, 'Unsure which assessment to choose'),
  professionals: object({ title: text('Heading'), body: body(), cta: text('Button label') }, 'For schools, NHS teams and commissioners'),
});

// ── Conditions ─────────────────────────────────────────────────────────────

const points = (label: string) => list(label, textarea('Point', { rows: 2, help: 'A line break starts a new line.' }), { help: 'Shown as bullet points.' });

export const conditionPageSchema: Field = object({
  label: text('Label', { help: 'The coral label above the hero.' }),
  hero: object(
    {
      tone: select('Card colour', CONDITION_HERO_TONES),
      title: heading(),
      body: body(),
      image: optional('Photo', photo('Photo'), 'Fills the right of the card.'),
      ...twoButtons('Main', '“Speak to a Specialist”'),
    },
    'Hero'
  ),
  details: object(
    { tone: select('Card colour', CONDITION_CARD_TONES), title: text('Heading'), body: body(), left: points('Left column'), right: points('Right column') },
    'Characteristics card'
  ),
  closing: object(
    {
      title: heading(),
      body: lines(),
      ...twoButtons('Main', '“Contact Us”'),
      squiggle: select('Left squiggle', { flipped: 'Upside down', upright: 'Upright' }),
      strokeLeft: select('Left stroke colour', STROKE_TONES),
      strokeRight: select('Right stroke colour', STROKE_TONES),
    },
    'Closing call to action'
  ),
});
