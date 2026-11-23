/**
 * Images already in public/, offered in the dashboard's photo picker.
 * Update this list when photos are added to the repo (sizes in pixels).
 */
export interface LibraryPhoto {
  src: string;
  width: number;
  height: number;
  /** Has a transparent background (suits cut-outs). */
  transparent: boolean;
}

export const PHOTO_LIBRARY: LibraryPhoto[] = [
  { src: '/background.png', width: 1920, height: 1080, transparent: false },
  { src: '/SVG/nurova2.svg', width: 504, height: 429, transparent: true },
  { src: '/logo-wordmark.svg', width: 504, height: 165, transparent: true },
  { src: '/images/home/hero.png', width: 820, height: 731, transparent: true },
  { src: '/images/home/journey.png', width: 932, height: 749, transparent: false },
  { src: '/images/home/help.png', width: 788, height: 548, transparent: true },
  { src: '/images/about/hero.png', width: 1023, height: 796, transparent: true },
  { src: '/images/about/mission.png', width: 472, height: 528, transparent: true },
  { src: '/images/about/vision.png', width: 472, height: 528, transparent: true },
  { src: '/images/about/values.png', width: 472, height: 528, transparent: true },
  { src: '/images/team/natalie-gillbanks.png', width: 763, height: 751, transparent: false },
  { src: '/images/team/james-bent.png', width: 763, height: 751, transparent: false },
  { src: '/images/team/ian-southerland.png', width: 763, height: 751, transparent: false },
  { src: '/images/about/quality/hero.webp', width: 2560, height: 1134, transparent: false },
  { src: '/images/about/quality/governance.webp', width: 1500, height: 1290, transparent: false },
  { src: '/images/about/approach/hero.webp', width: 2000, height: 1659, transparent: true },
  { src: '/images/about/team/hero.webp', width: 2560, height: 1192, transparent: false },
  { src: '/images/assessments/adults/adhd/hero.webp', width: 1400, height: 1596, transparent: true },
  { src: '/images/assessments/adults/adhd/why.webp', width: 1500, height: 1290, transparent: false },
  { src: '/images/assessments/adults/autism/hero.webp', width: 1300, height: 1950, transparent: true },
  { src: '/images/assessments/adults/hero.webp', width: 2560, height: 1134, transparent: false },
  { src: '/images/assessments/children/adhd/hero.webp', width: 1800, height: 1327, transparent: true },
  { src: '/images/assessments/children/adhd/why.webp', width: 1500, height: 1290, transparent: false },
  { src: '/images/assessments/children/autism/hero.webp', width: 1100, height: 1649, transparent: true },
  { src: '/images/assessments/children/autism/why.webp', width: 1500, height: 1290, transparent: false },
  { src: '/images/assessments/children/hero.webp', width: 2560, height: 1136, transparent: false },
  { src: '/images/assessments/combined/hero.webp', width: 2560, height: 1037, transparent: false },
  { src: '/images/assessments/combined/why.webp', width: 1500, height: 1290, transparent: false },
  { src: '/images/assessments/overview/hero.webp', width: 1500, height: 1477, transparent: true },
];
