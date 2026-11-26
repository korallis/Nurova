/*
 * Shared classes for the home page. From `xl` up, sizes are design units
 * measured from the 1920px-wide design (see app/globals.css); smaller screens
 * use normal responsive sizes.
 */

/** The page width: 1720 of the design's 1920px, with 100px either side. */
export const container = 'mx-auto w-[calc(100%-2.5rem)] sm:w-[calc(100%-4rem)] xl:u-w-1720';

/** The coral-to-purple brand gradient on the big cards. */
export const gradient = 'bg-brand-purple bg-[url(/graphics/backgrounds/gradient.png)] bg-cover bg-center';

/** The hero heading ("Clarity starts here."). */
export const displayHeading = 'text-[clamp(1.75rem,9.5vw,2.4rem)] font-bold leading-[1.05] break-words sm:text-6xl xl:u-text-90 xl:u-leading-100';

/** Section headings. */
export const sectionHeading = 'text-[2rem] font-bold leading-[1.1] sm:text-5xl sm:leading-[1.1] xl:u-text-70 xl:u-leading-70';

/** Body text. */
export const bodyText = 'text-base leading-relaxed sm:text-lg sm:leading-relaxed xl:u-text-25 xl:u-leading-45';
