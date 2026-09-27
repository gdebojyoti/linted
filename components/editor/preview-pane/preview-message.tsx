import type { ReactNode } from "react";

/** A short note shown in place of the page, e.g. while the Theme loads. */
export function PreviewMessage({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-1 pt-32 text-center">
      <p className="text-sm font-semibold">{title}</p>
      {children && <p className="max-w-80 text-[13px] text-ink-muted">{children}</p>}
    </div>
  );
}
