import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { getSingle } from '@/lib/content/queries';
import './globals.css';

const grift = localFont({
  src: [
    { path: '../public/fonts/Grift-Regular.ttf', weight: '400' },
    { path: '../public/fonts/Grift-Medium.ttf', weight: '500' },
    { path: '../public/fonts/Grift-Bold.ttf', weight: '700' },
  ],
  variable: '--font-grift-local',
});

const lexendDeca = localFont({
  src: [
    { path: '../public/fonts/LexendDeca-Regular.ttf', weight: '400' },
    { path: '../public/fonts/LexendDeca-Medium.ttf', weight: '500' },
    { path: '../public/fonts/LexendDeca-SemiBold.ttf', weight: '600' },
    { path: '../public/fonts/LexendDeca-Bold.ttf', weight: '700' },
  ],
  variable: '--font-lexend-deca-local',
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
    <html lang="en" className={`${grift.variable} ${lexendDeca.variable}`} data-scroll-behavior="smooth">
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
