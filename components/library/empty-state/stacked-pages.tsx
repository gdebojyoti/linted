/** Two blank pages, the front one sketching a Resume. Decoration only. */
export function StackedPages() {
  return (
    <div className="relative h-35 w-30" aria-hidden="true">
      <div className="absolute top-1.5 left-5.5 h-30 w-23 rotate-6 rounded-xs border border-line bg-surface" />
      <div className="absolute top-3 left-2.5 flex h-30 w-23 flex-col gap-1.5 rounded-xs border border-line-input bg-surface px-3 py-3.5 shadow-[0_6px_18px_rgb(0_0_0/0.08)]">
        <span className="h-1.25 w-11 rounded-xs bg-ink" />
        <span className="h-0.75 w-15 rounded-xs bg-line-input" />
        <span className="mt-2 h-0.75 w-5.5 rounded-xs bg-accent" />
        <span className="h-0.75 w-16.5 rounded-xs border border-dashed border-ink-disabled/60" />
        <span className="h-0.75 w-14 rounded-xs border border-dashed border-ink-disabled/60" />
        <span className="mt-2 h-0.75 w-5.5 rounded-xs bg-accent" />
        <span className="h-0.75 w-15.5 rounded-xs border border-dashed border-ink-disabled/60" />
      </div>
    </div>
  );
}
