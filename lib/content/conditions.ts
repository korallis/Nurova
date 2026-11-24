/**
 * The condition pages: the overview (/conditions) and the six condition pages
 * that share one template. Defaults are the copy from the designs.
 */
import { ROUTES } from '@/constants';
import type { AssessmentsOverviewContent, StrokeTone } from './assessments';
import { DEFAULT_ASSESSMENTS_OVERVIEW } from './assessments';
import type { Photo } from './fields';

const photo = (src: string, alt: string, width: number, height: number): Photo => ({ src, alt, width, height });

// ── Colour choices (shown as options in the dashboard) ─────────────────────

/** The hero card. Light colours take purple text; the rest white. */
export const CONDITION_HERO_TONES = { lilac: 'Lilac', salmon: 'Salmon', violet: 'Violet', purple: 'Deep purple', coral: 'Coral' } as const;
export type ConditionHeroTone = keyof typeof CONDITION_HERO_TONES;

/** The card under the hero. */
export const CONDITION_CARD_TONES = { violet: 'Violet', purple: 'Deep purple', coral: 'Coral' } as const;
export type ConditionCardTone = keyof typeof CONDITION_CARD_TONES;

// ── The six condition pages ────────────────────────────────────────────────

export interface ConditionPageContent {
  /** The coral label above the hero. */
  label: string;
  hero: {
    tone: ConditionHeroTone;
    title: string;
    body: string;
    /** Fills the right of the card. */
    image: Photo | null;
    primaryCta: string;
    secondaryCta: string;
  };
  /** "Common characteristics": a paragraph, then two columns of points. */
  details: { tone: ConditionCardTone; title: string; body: string; left: string[]; right: string[] };
  closing: {
    title: string;
    body: string;
    primaryCta: string;
    secondaryCta: string;
    /** Which way up the left-hand squiggle is drawn, as in each design. */
    squiggle: 'flipped' | 'upright';
    strokeLeft: StrokeTone;
    strokeRight: StrokeTone;
  };
}

const hero = (tone: ConditionHeroTone, title: string, body: string, image: Photo) => ({
  tone,
  title,
  body,
  image,
  primaryCta: 'Book an Assessment',
  secondaryCta: 'Speak to a Specialist',
});

const closing = (title: string, strokeLeft: StrokeTone = 'lavender', strokeRight: StrokeTone = 'pink', squiggle: 'flipped' | 'upright' = 'flipped') => ({
  title,
  body: 'Explore assessment and support options with Nurova Minds.\nChat to one of our clinicians or book an assessment.',
  primaryCta: 'Book an Assessment',
  secondaryCta: 'Contact Us',
  squiggle,
  strokeLeft,
  strokeRight,
});

export const DEFAULT_CONDITION_ADHD: ConditionPageContent = {
  label: 'ADHD',
  hero: hero(
    'lilac',
    'ADHD looks different\nfor everyone.',
    'ADHD is a neurodevelopmental condition affecting attention regulation, impulse management, organisation and executive functioning.',
    photo('/images/conditions/adhd/hero.webp', 'A boy resting his chin on his hands, looking at his schoolwork', 1300, 1546)
  ),
  details: {
    tone: 'violet',
    title: 'Common characteristics',
    body: 'ADHD looks different for everyone. You might lose track of a conversation, misplace everyday items or start a task and get sidetracked before finishing it. Planning ahead and estimating how long things will take can also be hard. Some people feel restless, interrupt without meaning to or act before they’ve had time to think. You might also find that frustration comes on quickly or that you get so absorbed in something you enjoy that you lose track of time.',
    left: ['Difficulty sustaining attention', 'forgetfulness', 'losing items', 'disorganisation', 'restlessness'],
    right: ['impulsivity', 'emotional sensitivity', 'time blindness', 'unfinished tasks', 'hyperfocus'],
  },
  closing: closing('Understanding ADHD\nis the first step.', 'coral', 'coral'),
};

export const DEFAULT_CONDITION_AUDHD: ConditionPageContent = {
  label: 'AuDHD',
  hero: hero(
    'violet',
    'Understanding both\nsides of the picture.',
    'Many people experience characteristics associated with both ADHD and Autism. A combined assessment explores the full profile rather than viewing either condition in isolation.',
    photo('/images/conditions/audhd/hero.webp', 'A young person sitting with their knees drawn up during a session', 1500, 1528)
  ),
  details: {
    tone: 'violet',
    title: 'Why combined assessments matter',
    body: 'A combined assessment looks at how ADHD and autism may show up together in your or your child’s everyday life. Your clinician might ask what helps you focus, how you keep track of tasks, what makes conversations easier or how you respond to noise, changes in plans and strong emotions. Looking at these experiences together helps the clinician understand where ADHD and autism may overlap and what support could make daily life easier.',
    left: ['They can explore attention', 'executive functioning', 'communication', 'sensory processing'],
    right: ['emotional regulation', 'overlapping behaviour\npatterns'],
  },
  closing: closing('Discover the whole\npicture'),
};

export const DEFAULT_CONDITION_AUTISM: ConditionPageContent = {
  label: 'Autism',
  hero: hero(
    'salmon',
    'Every autistic person\nis unique.',
    'Autism is a lifelong neurodevelopmental difference influencing communication, relationships, sensory experiences and how someone experiences the world.',
    photo('/images/conditions/autism/hero.webp', 'A mother and her laughing toddler cheek to cheek', 1400, 1519)
  ),
  details: {
    tone: 'coral',
    title: 'Common characteristics',
    body: 'Autism looks different for everyone. You might prefer clear, direct communication or find unwritten social rules hard to read. Familiar routines can feel reassuring, and a last-minute change might take time to adjust to. Sounds, lights or certain textures may feel particularly intense, while a favourite interest can bring a lot of enjoyment. You might also need some quiet time after socialising, even when you’ve enjoyed being with people.',
    left: ['Differences in social communication', 'preference for routine', 'sensory sensitivities', 'focused interests'],
    right: ['difficulty with\nunexpected change', 'emotional fatigue\nafter social interaction'],
  },
  closing: closing('Greater understanding\nstarts here.'),
};

export const DEFAULT_CONDITION_DYSLEXIA: ConditionPageContent = {
  label: 'Dyslexia',
  hero: hero(
    'purple',
    'Different ways of learning\ndeserve different kinds\nof support.',
    'Dyslexia affects the processing of written language, spelling and reading. It does not reflect intelligence or potential.',
    photo('/images/conditions/dyslexia/hero.webp', 'A young person with their hands on their head, looking puzzled', 1050, 1524)
  ),
  details: {
    tone: 'purple',
    title: 'Common signs',
    body: 'Dyslexia looks different for everyone. You might take longer to read a page, pause to work out unfamiliar words or spell the same word differently on different occasions. Putting your ideas into writing can take more effort, even when you can explain them clearly out loud. Some people also find it harder to remember instructions in the right order or organise their thoughts before writing.',
    left: ['Reading and spelling difficulties', 'slow reading speed', 'written-expression challenges'],
    right: ['sequencing difficulties', 'organisation challenges'],
  },
  closing: closing('Helping every learner\nreach their potential.'),
};

export const DEFAULT_CONDITION_DYSPRAXIA: ConditionPageContent = {
  label: 'Dyspraxia',
  hero: hero(
    'coral',
    'Understanding\nmovement, coordination\nand everyday skills.',
    'Dyspraxia, also known as Developmental Coordination Disorder, affects movement, coordination and planning.',
    photo('/images/conditions/dyspraxia/hero.webp', 'A young woman with folded arms looking up at the camera', 1050, 1524)
  ),
  details: {
    tone: 'violet',
    title: 'Common characteristics',
    body: 'Dyspraxia looks different for everyone. You might find it harder to balance when riding a bike, coordinate your movements to catch a ball or manage tasks that need precise hand movements, such as fastening buttons or handwriting. Planning the steps in a task or organising what you need can also take more effort. When everyday activities need this much concentration, you may feel tired afterwards.',
    left: ['Coordination difficulties', 'balance challenges', 'organisation'],
    right: ['planning, fine', 'gross motor skills', 'fatigue'],
  },
  closing: closing('Helping individuals build\nconfidence every day.'),
};

export const DEFAULT_CONDITION_EXECUTIVE_FUNCTION: ConditionPageContent = {
  label: 'Executive Function',
  hero: hero(
    'violet',
    'When everyday tasks\nfeel harder than they\nshould.',
    'Executive functioning refers to mental skills used to organise, prioritise, remember information, manage emotions and complete tasks.',
    photo('/images/conditions/executive-function/hero.webp', 'A boy thinking while building a molecular model', 1250, 1525)
  ),
  details: {
    tone: 'coral',
    title: 'Executive-function skills',
    body: 'Executive function skills help you manage everyday tasks. You use them when you decide what needs doing first, break a task into steps or work out how much time you’ll need. Working memory helps you keep information in mind while you use it, like remembering the next step in a recipe while you’re cooking. These skills also help you change course when plans shift, notice when you’ve missed a step and manage frustration when something takes longer than expected.',
    left: ['Planning', 'organisation', 'working memory', 'time management'],
    right: ['emotional regulation', 'flexible thinking', 'self-monitoring', 'prioritisation'],
  },
  closing: closing('Understanding leads to\nbetter support.', 'violet', 'salmon', 'upright'),
};

// ── Overview (/conditions) ─────────────────────────────────────────────────

/** Same layout as the assessments overview. */
export const DEFAULT_CONDITIONS_OVERVIEW: AssessmentsOverviewContent = {
  ...DEFAULT_ASSESSMENTS_OVERVIEW,
  label: 'Conditions',
  hero: {
    title: 'Conditions & neurodevelopmental\ndifferences',
    body: 'Whether you’re looking for information for yourself or your child, start here. Explore each topic to learn how it can show up in everyday life and what support may help.',
    image: photo('/images/conditions/overview/hero.webp', 'A smiling father giving his son a piggyback ride', 1800, 1106),
    primaryCta: 'Explore Assessments',
    secondaryCta: 'Speak to a Specialist',
  },
  cards: [
    { title: 'ADHD', body: 'Learn about ADHD and how it can show up in children and adults.', href: ROUTES.conditionAdhd },
    { title: 'Autism', body: 'Learn about autism and the different ways autistic people may experience everyday life.', href: ROUTES.conditionAutism },
    { title: 'Dyspraxia', body: 'Learn about dyspraxia and how it can affect movement and coordination.', href: ROUTES.conditionDyspraxia },
    { title: 'Dyslexia', body: 'Learn about dyslexia and how it can affect reading, spelling and writing.', href: ROUTES.conditionDyslexia },
    { title: 'AuDHD', body: 'Learn about AuDHD and what it can mean when ADHD and autism show up together.', href: ROUTES.conditionAudhd },
  ],
  unsure: {
    ...DEFAULT_ASSESSMENTS_OVERVIEW.unsure,
    title: 'Unsure where to start?',
    body: 'Tell us what you’ve noticed. We can talk through the assessment\noptions and help you decide what to do next.',
  },
};
