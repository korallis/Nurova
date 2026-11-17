import { Fragment } from 'react';

/**
 * Text with the line breaks typed in the dashboard. Headings break only from
 * `xl` up (where the layout follows the design) unless `always` is set; on
 * smaller screens the words just wrap.
 */
export function MultiLine({ text, always = false }: { text: string; always?: boolean }) {
  return text.split('\n').map((line, i) => (
    <Fragment key={i}>
      {/* The space keeps words apart where the break is hidden. */}
      {i > 0 && (
        <>
          {' '}
          <br className={always ? undefined : 'hidden xl:inline'} />
        </>
      )}
      {line}
    </Fragment>
  ));
}
