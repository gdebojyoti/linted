/** A tiny sketch of a Resume page, shown beside each Resume Title. Decoration only. */
export function ResumeThumbnail() {
  return (
    <span
      className="flex h-9 w-7 shrink-0 flex-col gap-0.5 rounded-[3px] border border-line-input bg-surface px-1 py-[5px]"
      aria-hidden="true"
    >
      <span className="h-[3px] w-3 rounded-[1px] bg-ink" />
      <span className="h-0.5 w-4 rounded-[1px] bg-line-input" />
      <span className="mt-0.5 h-0.5 w-2 rounded-[1px] bg-accent" />
      <span className="h-0.5 w-[18px] rounded-[1px] bg-line" />
      <span className="h-0.5 w-3.5 rounded-[1px] bg-line" />
    </span>
  );
}
