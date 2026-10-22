import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { default: 'Dashboard', template: '%s | Nurova admin' },
  // Keep the dashboard out of search engines.
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: LayoutProps<'/admin'>) {
  return <div className="min-h-screen w-full bg-neutral-50 text-brand-ink">{children}</div>;
}
