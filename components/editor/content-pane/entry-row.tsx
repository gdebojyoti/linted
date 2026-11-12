import type { ReactNode, Ref } from "react";
import { Checkbox } from "@/components/ui/checkbox";

/**
 * Lines the checkbox and the action up with the first input. Fields with
 * visible labels need an offset for the label (a text-xs label plus the gap
 * below it); unlabelled ones don't.
 */
const alignWithInput = "flex h-9 shrink-0 items-center";
const labelOffset = "mt-5.5";

/**
 * One Entry in a Section's fields: its Enabled checkbox, its fields, and an
 * optional action. MovableEntryRow fills in `ref`, `grip`, `className` and
 * `overlay` to make it draggable.
 */
export function EntryRow({
  name,
  enabled,
  onEnabledChange,
  action,
  columns = "grid-flow-col auto-cols-fr",
  labelledFields = true,
  ref,
  grip,
  className = "",
  overlay,
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
  ref?: Ref<HTMLLIElement>;
  /** Drawn before the checkbox, lined up with it. */
  grip?: ReactNode;
  className?: string;
  /** Drawn over the row, e.g. a drop marker. */
  overlay?: ReactNode;
  children: ReactNode;
}) {
  const align = labelledFields ? `${labelOffset} ${alignWithInput}` : alignWithInput;

  return (
    <li ref={ref} className={`flex items-start gap-2.5 ${className}`}>
      {grip && <div className={align}>{grip}</div>}
      <div className={align}>
        <Checkbox
          checked={enabled}
          onCheckedChange={(checked) => onEnabledChange(checked)}
          aria-label={`${name} enabled`}
        />
      </div>
      <div className={`grid min-w-0 grow gap-3 ${columns}`}>{children}</div>
      {action && <div className={`${align} gap-1`}>{action}</div>}
      {overlay}
    </li>
  );
}
