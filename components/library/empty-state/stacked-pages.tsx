/** Two blank pages, the front one sketching a Resume. Decoration only. */
export function StackedPages() {
  return (
    <div className="relative h-[140px] w-[120px]" aria-hidden="true">
      <div className="absolute top-1.5 left-[22px] h-[120px] w-[92px] rotate-6 rounded-xs border border-line bg-surface" />
      <div className="absolute top-3 left-2.5 flex h-[120px] w-[92px] flex-col gap-1.5 rounded-xs border border-line-input bg-surface px-3 py-3.5 shadow-[0_6px_18px_rgb(0_0_0/0.08)]">
        <span className="h-[5px] w-11 rounded-xs bg-ink" />
        <span className="h-[3px] w-[60px] rounded-xs bg-line-input" />
        <span className="mt-2 h-[3px] w-[22px] rounded-xs bg-accent" />
        <span className="h-[3px] w-[66px] rounded-xs border border-dashed border-ink-disabled/60" />
        <span className="h-[3px] w-14 rounded-xs border border-dashed border-ink-disabled/60" />
        <span className="mt-2 h-[3px] w-[22px] rounded-xs bg-accent" />
        <span className="h-[3px] w-[62px] rounded-xs border border-dashed border-ink-disabled/60" />
      </div>
    </div>
  );
}
