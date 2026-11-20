/**
 * Every editable document on the site. The dashboard lists these, the editor
 * uses their schemas, and the site reads them through lib/content/queries.ts.
 *
 * To make a new page editable: add its type and defaults to pages.ts, its
 * schema to schemas.ts, and an entry here. The dashboard picks it up.
 *
 * Muve Futures also has collections (lists of similar pages such as services,
 * stored as `<collection>:<slug>`); copy that part of its registry across when
 * Nurova needs them.
 */
import type { Field } from './fields';
import { DEFAULT_ABOUT, DEFAULT_HOME, DEFAULT_SETTINGS, type AboutContent, type HomeContent, type SettingsContent } from './pages';
import { aboutSchema, homeSchema, settingsSchema } from './schemas';

interface SingleDef<T> {
  label: string;
  description: string;
  schema: Field;
  defaults: T;
  /** Public page to preview after saving. */
  path: string;
}

export interface SingleTypes {
  settings: SettingsContent;
  home: HomeContent;
  about: AboutContent;
}

export type SingleKey = keyof SingleTypes;

export const SINGLES: { [K in SingleKey]: SingleDef<SingleTypes[K]> } = {
  settings: {
    label: 'Site settings & coming-soon page',
    description: 'Site name, tagline, search engine text, contact details, office address, social links, footer and the coming-soon page.',
    schema: settingsSchema,
    defaults: DEFAULT_SETTINGS,
    path: '/',
  },
  home: { label: 'Home page', description: 'Every section of the home page.', schema: homeSchema, defaults: DEFAULT_HOME, path: '/home' },
  about: { label: 'About page', description: 'Hero, purpose, mission, vision and values, the team and the closing call to action.', schema: aboutSchema, defaults: DEFAULT_ABOUT, path: '/about' },
};

/** Whether `key` names an editable document. Own-property check, so names like "constructor" aren't mistaken for content. */
export const isSingleKey = (key: string): key is SingleKey => Object.hasOwn(SINGLES, key);

/** Cache tags: saving a document refreshes every page that reads it. */
export const contentTag = {
  single: (key: SingleKey) => `content:${key}`,
};
