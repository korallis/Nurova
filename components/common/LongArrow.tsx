/** The long, thin arrow after "Learn More" links. */
export function LongArrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 54 16" fill="none" aria-hidden="true" className={className}>
      <path d="M1 8h51M45 1.5 52 8l-7 6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
