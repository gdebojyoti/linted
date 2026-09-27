/** The "linted" wordmark with its tick badge, shown at the left of every header. */
export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex size-6 items-center justify-center rounded-sm bg-accent text-white">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M5 12l5 5 9-10" />
        </svg>
      </div>
      <span className="text-[15px] font-semibold tracking-tight">linted</span>
    </div>
  );
}
