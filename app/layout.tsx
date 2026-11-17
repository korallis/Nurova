import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { getSingle } from '@/lib/content/queries';
import './globals.css';

/*
 * Grift is the brand font and the only typeface on the site, dashboard
 * included. It comes in three weights: semibold (600) text uses Bold, the
 * nearest heavier weight, so browsers never fake a bold.
 *
 * These are the web copies built by `bun run fonts:build` (no hinting, which
 * broke the "M" at small sizes on Windows); the original TTFs are kept beside them.
 */
const grift = localFont({
  src: [
    { path: '../public/fonts/Grift-Regular.woff', weight: '400', style: 'normal' },
    { path: '../public/fonts/Grift-Medium.woff', weight: '500', style: 'normal' },
    { path: '../public/fonts/Grift-Bold.woff', weight: '700', style: 'normal' },
  ],
  variable: '--font-grift-local',
  display: 'swap',
  fallback: ['Segoe UI', 'Helvetica Neue', 'Arial', 'sans-serif'],
});

// Site name, tagline and description are edited in the dashboard (Site settings).
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSingle('settings');
  return {
    title: {
      default: `${settings.siteName} | ${settings.tagline}`,
      template: `%s | ${settings.siteName}`,
    },
    description: settings.description,
  };
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en-GB" className={grift.variable} data-scroll-behavior="smooth">
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
