/**
 * A Theme card's small page diagram, as the design draws it: a name and
 * headline across the top, then one column of lines, or a sidebar beside
 * them. Section titles are drawn in the Resume's accent. Decorative only.
 */
export function MiniPage({ columns, accent }: { columns: 1 | 2; accent: string }) {
  const titleLine = { background: accent };
  return (
    <span
      aria-hidden="true"
      className="flex h-15 w-11.5 shrink-0 flex-col gap-0.75 rounded-[3px] border border-line bg-app px-1.25 py-1.5"
    >
      <span className="h-0.75 w-5 rounded-[1px] bg-ink" />
      <span className="h-0.5 w-7 rounded-[1px] bg-line-input" />
      <span className="mt-1 flex grow gap-0.75">
        {columns === 2 && (
          <span className="flex w-2.5 flex-col gap-0.75">
            <span className="h-0.5 rounded-[1px]" style={titleLine} />
            <span className="h-0.5 rounded-[1px] bg-line-input" />
            <span className="h-0.5 rounded-[1px] bg-line-input" />
          </span>
        )}
        <span className="flex grow flex-col gap-0.75">
          <span className="h-0.5 w-3 rounded-[1px]" style={titleLine} />
          <span className="h-0.5 rounded-[1px] bg-line-input" />
          <span className="h-0.5 rounded-[1px] bg-line-input" />
          <span className="mt-0.5 h-0.5 w-3 rounded-[1px]" style={titleLine} />
          <span className="h-0.5 rounded-[1px] bg-line-input" />
        </span>
      </span>
    </span>
  );
}
