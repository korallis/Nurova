/**
 * Images already in public/, offered in the dashboard's photo picker.
 * Update this list when photos are added to the repo (sizes in pixels).
 */
export interface LibraryPhoto {
  src: string;
  width: number;
  height: number;
  /** Has a transparent background (suits cut-outs). */
  transparent: boolean;
}

export const PHOTO_LIBRARY: LibraryPhoto[] = [
  { src: '/background.png', width: 1920, height: 1080, transparent: false },
  { src: '/SVG/nurova2.svg', width: 504, height: 429, transparent: true },
  { src: '/logo-wordmark.svg', width: 504, height: 165, transparent: true },
];
