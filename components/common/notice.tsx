import type { ReactNode } from "react";

/**
 * A short, centred note in place of content: a heading, an optional line of
 * text, and optional buttons under them. Where it sits is up to the caller.
 *
 * Screen readers read a "status" note when they finish what they're saying,
 * and an "alert" (for errors) straight away. Only the heading and text are
 * read out, not the buttons.
 */
export function Notice({
  title,
  children,
  actions,
  role = "status",
}: {
  title: string;
  children?: ReactNode;
  actions?: ReactNode;
  role?: "status" | "alert";
}) {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div role={role} className="flex flex-col items-center gap-1">
        <p className="text-sm font-semibold">{title}</p>
        {children && <p className="max-w-80 text-[13px] text-ink-muted">{children}</p>}
      </div>
      {actions && <div className="flex items-center gap-2.5">{actions}</div>}
    </div>
  );
}
