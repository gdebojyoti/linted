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
  children,
}: {
  /** Names the Entry for screen readers, e.g. "Email" or "GitHub link". */
  name: string;
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  action?: ReactNode;
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
      <div className="grid min-w-0 grow grid-flow-col auto-cols-fr gap-3">{children}</div>
      {action && <div className={alignWithInput}>{action}</div>}
    </li>
  );
}
