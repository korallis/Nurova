import type { SettingsContent } from './pages';

/** Site-wide data for the header and footer, read from the CMS. */
export interface SiteChrome {
  settings: SettingsContent;
}
