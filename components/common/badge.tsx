export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-xs border border-line px-1.5 py-0.5 text-[11px] text-ink-muted">
      {children}
    </span>
  );
}
