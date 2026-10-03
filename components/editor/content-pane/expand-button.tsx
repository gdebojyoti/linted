/**
 * The chevron that opens and closes a Section's or an Entry's fields.
 * `name` completes its label for screen readers: "Expand Experience",
 * "Collapse Paystream entry".
 */
export function ExpandButton({
  expanded,
  onClick,
  controls,
  name,
}: {
  expanded: boolean;
  onClick: () => void;
  /** The id of the fields it shows and hides. */
  controls: string;
  name: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={expanded}
      aria-controls={controls}
      aria-label={`${expanded ? "Collapse" : "Expand"} ${name}`}
      className="flex size-8 shrink-0 items-center justify-center rounded-sm text-ink-muted hover:bg-subtle"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className={expanded ? "rotate-180" : undefined}
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </button>
  );
}
