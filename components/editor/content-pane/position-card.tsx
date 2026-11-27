import { useId } from "react";
import { Badge } from "@/components/common/badge";
import { TextField } from "@/components/common/text-field";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDateRange } from "@/lib/format/date-range";
import { currentLabel } from "@/lib/resume/current-label";
import { setPositionEnabled, updatePosition } from "@/lib/resume/positions";
import type { Position, ResumeEdit } from "@/lib/resume/types";
import { BulletsFields } from "./bullets-fields";
import { DatesFields } from "./dates-fields";
import { DeleteEntryButton } from "./delete-entry-button";
import { ExpandButton } from "./expand-button";
import { isControlClick } from "./is-control-click";

/**
 * One Position of an Experience Entry with two or more, as a small card
 * inside the Entry's card: a header line with its Enabled checkbox, its role
 * ("New position" while it's blank), "Current" or its dates, a delete button
 * and a chevron. Clicking anywhere on the line opens or closes it, except on
 * its controls. Open, it holds the role, dates and Bullets. The parent keeps
 * one Position open at a time. A new Position has focus on Role.
 *
 * Positions have no grip or arrows: only "Sort by date" reorders them.
 */
export function PositionCard({
  position,
  name,
  expanded,
  onToggle,
  onDelete,
  isNew,
  onEdit,
}: {
  position: Position;
  /** Names the Position for screen readers, e.g. "Staff Engineer position". */
  name: string;
  expanded: boolean;
  onToggle: () => void;
  onDelete: () => void;
  isNew: boolean;
  onEdit: (edit: ResumeEdit) => void;
}) {
  const bodyId = useId();
  const role = position.role.trim();

  return (
    <li className="rounded-lg border border-line bg-surface-nested">
      <div
        onClick={(event) => !isControlClick(event) && onToggle()}
        className="flex min-h-11 cursor-pointer items-center gap-2.5 pr-1 pl-3 select-none"
      >
        <Checkbox
          checked={position.enabled}
          onCheckedChange={(enabled) => onEdit((r) => setPositionEnabled(r, position.id, enabled))}
          aria-label={`${name} enabled`}
        />
        <div
          className={`min-w-0 grow truncate text-[13px] font-medium ${position.enabled ? "text-ink" : "text-ink-disabled"}`}
        >
          {role || <span className="font-normal text-ink-meta">New position</span>}
        </div>
        <div className="shrink-0 text-xs text-ink-meta">
          {position.dates.current ? <Badge>Current</Badge> : formatDateRange(position.dates)}
        </div>
        <DeleteEntryButton label={`Delete ${name}`} onClick={onDelete} />
        <ExpandButton expanded={expanded} onClick={onToggle} controls={bodyId} name={name} />
      </div>
      <div id={bodyId} hidden={!expanded} className="border-t border-line-soft px-3 pt-3 pb-4">
        <div className="flex flex-col gap-4">
          <TextField
            label="Role"
            placeholder="e.g. Backend Engineer"
            value={position.role}
            onChange={(role) => onEdit((r) => updatePosition(r, position.id, { role }))}
            autoFocus={isNew}
          />
          <DatesFields
            entryId={position.id}
            dates={position.dates}
            currentLabel={currentLabel("experience")}
            onEdit={onEdit}
          />
          <BulletsFields entryId={position.id} bullets={position.bullets} onEdit={onEdit} />
        </div>
      </div>
    </li>
  );
}
