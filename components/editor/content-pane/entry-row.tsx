import type { ReactNode } from "react";
import { Checkbox } from "@/components/ui/checkbox";

/**
 * Lines the checkbox and the action up with the first input. Fields with
 * visible labels need an offset for the label (a text-xs label plus the gap
 * below it); unlabelled ones don't.
 */
const alignWithInput = "flex h-9 shrink-0 items-center";
const labelOffset = "mt-5.5";

/** One Entry in a Section's fields: its Enabled checkbox, its fields, and an optional action. */
export function EntryRow({
  name,
  enabled,
  onEnabledChange,
  action,
  columns = "grid-flow-col auto-cols-fr",
  labelledFields = true,
  children,
}: {
  /** Names the Entry for screen readers, e.g. "Email" or "GitHub link". */
  name: string;
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  action?: ReactNode;
  /** Tailwind grid classes for the fields; by default they share the width equally. */
  columns?: string;
  /** Whether the fields show labels above them. False when they're named for screen readers only. */
  labelledFields?: boolean;
  children: ReactNode;
}) {
  const align = labelledFields ? `${labelOffset} ${alignWithInput}` : alignWithInput;

  return (
    <li className="flex items-start gap-2.5">
      <div className={align}>
        <Checkbox
          checked={enabled}
          onCheckedChange={(checked) => onEnabledChange(checked)}
          aria-label={`${name} enabled`}
        />
      </div>
      <div className={`grid min-w-0 grow gap-3 ${columns}`}>{children}</div>
      {action && <div className={align}>{action}</div>}
    </li>
  );
}
