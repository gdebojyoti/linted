/**
 * Text read out to screen readers when it changes, e.g. after a move, and
 * not shown on screen. Keep it on the page from the start, so the first
 * message is heard.
 */
export function LiveMessage({ message }: { message: string }) {
  return (
    <p aria-live="polite" className="sr-only">
      {message}
    </p>
  );
}
