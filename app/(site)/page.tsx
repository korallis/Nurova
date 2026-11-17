import { HomeSections } from '@/components/home/HomeSections';
import { getSingle } from '@/lib/content/queries';

export default async function HomePage() {
  return <HomeSections content={await getSingle('home')} />;
}
