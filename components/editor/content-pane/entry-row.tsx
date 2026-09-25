import type { ReactNode } from "react";
import { Checkbox } from "@/components/ui/checkbox";

// Offsets the checkbox and the action so they line up with the inputs, not
// with the labels above them (a text-xs label plus the gap below it).
const alignWithInput = "mt-5.5 flex h-9 shrink-0 items-center";

/** One Entry in a Section's fields: its Enabled checkbox, its fields, and an optional action. */
export function EntryRow({
  name,
  enabled,
  onEnabledChange,
  action,
  columns = "grid-flow-col auto-cols-fr",
  children,
}: {
  /** Names the Entry for screen readers, e.g. "Email" or "GitHub link". */
  name: string;
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  action?: ReactNode;
  /** Tailwind grid classes for the fields; by default they share the width equally. */
  columns?: string;
  children: ReactNode;
}) {
  return (
    <li className="flex items-start gap-2.5">
      <div className={alignWithInput}>
        <Checkbox
          checked={enabled}
          onCheckedChange={(checked) => onEnabledChange(checked)}
          aria-label={`${name} enabled`}
        />
      </div>
      <div className={`grid min-w-0 grow gap-3 ${columns}`}>{children}</div>
      {action && <div className={alignWithInput}>{action}</div>}
    </li>
  );
}
