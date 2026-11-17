import 'server-only';
import { getSingle } from './queries';
import type { SiteChrome } from './chrome-types';

export type { SiteChrome };

/** Header and footer content for every public page. The menu itself is in constants/navigation.ts. */
export async function getSiteChrome(): Promise<SiteChrome> {
  return { settings: await getSingle('settings') };
}
