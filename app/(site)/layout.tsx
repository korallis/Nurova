import { AppShell } from '@/components/common/AppShell';
import { getSiteChrome } from '@/lib/content/chrome';

// Header and footer content come from the CMS (see lib/content). Pages outside
// this group, such as /coming-soon and the dashboard, don't have them.
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const chrome = await getSiteChrome();
  return <AppShell chrome={chrome}>{children}</AppShell>;
}
