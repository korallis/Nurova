import { ComingSoon } from '@/components/coming-soon/ComingSoon';
import { getSingle } from '@/lib/content/queries';

export default async function ComingSoonPage() {
  const settings = await getSingle('settings');
  return <ComingSoon settings={settings} />;
}
