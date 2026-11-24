import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Images uploaded from the dashboard (Vercel Blob).
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
    ],
  },
  // Images were reorganised into page folders (public/images/<page>/…). Content
  // saved in the dashboard before that still uses the old flat names, so those
  // keep working here. Remove an entry once nothing saved points at it.
  async rewrites() {
    const moved: Record<string, string> = {
      'home-hero.png': 'home/hero.png',
      'home-journey.png': 'home/journey.png',
      'home-help.png': 'home/help.png',
      'about-hero.png': 'about/hero.png',
      'about-mission.png': 'about/mission.png',
      'about-vision.png': 'about/vision.png',
      'about-values.png': 'about/values.png',
      'team-natalie-gillbanks.png': 'team/natalie-gillbanks.png',
      'team-james-bent.png': 'team/james-bent.png',
      'team-ian-southerland.png': 'team/ian-southerland.png',
      'quality-hero.webp': 'about/quality/hero.webp',
      'quality-governance.webp': 'about/quality/governance.webp',
      'approach-hero.webp': 'about/approach/hero.webp',
      'team-hero.webp': 'about/team/hero.webp',
    };
    // Graphics moved into public/graphics/ (logo, icons, backgrounds).
    const graphics: Record<string, string> = {
      '/background.png': '/graphics/backgrounds/gradient.png',
      '/background.svg': '/graphics/backgrounds/gradient.svg',
      '/logo-wordmark.svg': '/graphics/logo/wordmark.svg',
      '/SVG/nurova2.svg': '/graphics/logo/stacked.svg',
      '/SVG/nurova.svg': '/graphics/logo/stacked-with-tagline.svg',
      '/icons/linkedin.svg': '/graphics/icons/linkedin.svg',
      '/icons/instagram.svg': '/graphics/icons/instagram.svg',
      '/icons/facebook.svg': '/graphics/icons/facebook.svg',
    };
    return [
      ...Object.entries(moved).map(([from, to]) => ({ source: `/images/${from}`, destination: `/images/${to}` })),
      ...Object.entries(graphics).map(([source, destination]) => ({ source, destination })),
    ];
  },
  async redirects() {
    return [
      // Pre-launch: the home page shows the coming-soon page. At launch, add the
      // home page (app/(site)/page.tsx) and replace this with
      // { source: '/coming-soon', destination: '/', permanent: false }.
      { source: '/', destination: '/coming-soon', permanent: false },
      // Early home-page links, before the assessment pages were split into adults and children.
      { source: '/assessments/adhd', destination: '/assessments', permanent: true },
      { source: '/assessments/autism', destination: '/assessments', permanent: true },
    ];
  },
};

export default nextConfig;
