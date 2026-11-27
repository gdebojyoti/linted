import { ArrowDownUp } from "lucide-react";
import { useId, useRef, useState } from "react";
import { Badge } from "@/components/common/badge";
import { LiveMessage } from "@/components/common/live-message";
import { TextField } from "@/components/common/text-field";
import { Button } from "@/components/ui/button";
import { formatDateRange } from "@/lib/format/date-range";
import { currentLabel } from "@/lib/resume/current-label";
import { positionsDateRange, positionsOutOfOrder } from "@/lib/resume/position-dates";
import { addPosition, deletePosition, sortPositions, updatePosition } from "@/lib/resume/positions";
import type { DateRange, ExperienceEntry, ResumeEdit } from "@/lib/resume/types";
import { updateExperienceEntry } from "@/lib/resume/update-experience-entry";
import { AddEntryButton } from "./add-entry-button";
import { BulletsFields } from "./bullets-fields";
import { DatesFields } from "./dates-fields";
import { EntryCard } from "./entry-card";
import type { EntryCardProps } from "./entry-card-list";
import { PositionCard } from "./position-card";

/**
 * An Experience Entry: a company, and the Positions held there. Its card's
 * header line shows the company, then the role, or "3 positions" when two or
 * more are Enabled, and "Current" or the dates its Enabled Positions cover.
 *
 * With one Position the card looks as it did before Positions existed:
 * Company, Role, Location, dates and Bullets, then "Add position". With two
 * or more, Company and Location come first, then a card per Position, one
 * open at a time. Adding one puts it at the bottom, open, with focus on Role.
 * Positions are never reordered on their own: while they're out of date
 * order, "Sort by date" offers to sort them. A new Entry has focus on Company.
 */
export function ExperienceEntryCard({
  entry,
  name,
  heading,
  reorder,
  onEdit,
  onEnabledChange,
  onDelete,
  expanded,
  onToggle,
  isNew,
}: {
  entry: ExperienceEntry;
  onEdit: (edit: ResumeEdit) => void;
} & EntryCardProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const positionsLabelId = useId();
  const { positions } = entry;
  const single = positions.length === 1 ? positions[0] : null;

  function add() {
    const id = crypto.randomUUID();
    onEdit((r) => addPosition(r, entry.id, { newId: () => id }));
    setAddedId(id);
    setOpenId(id);
  }

  function remove(positionId: string) {
    onEdit((r) => deletePosition(r, positionId));
    addButtonRef.current?.focus();
  }

  function sort() {
    onEdit((r) => sortPositions(r, entry.id));
    setAnnouncement("Positions sorted by date.");
    addButtonRef.current?.focus();
  }

  const range: DateRange = single ? single.dates : positionsDateRange(positions.filter((p) => p.enabled));

  return (
    <EntryCard
      name={name}
      enabled={entry.enabled}
      onEnabledChange={onEnabledChange}
      onDelete={onDelete}
      expanded={expanded}
      onToggle={onToggle}
      reorder={reorder}
      heading={heading}
      meta={range.current ? <Badge>Current</Badge> : formatDateRange(range)}
    >
      <div className="flex flex-col gap-4">
        {/* Company stays first in both forms, so it isn't remade (and refocused) when the form changes. */}
        <div className="grid grid-cols-2 gap-3">
          <TextField
            label="Company"
            placeholder="e.g. Paystream"
            value={entry.company}
            onChange={(company) => onEdit((r) => updateExperienceEntry(r, entry.id, { company }))}
            autoFocus={isNew}
          />
          {single ? (
            <TextField
              key="role"
              label="Role"
              placeholder="e.g. Backend Engineer"
              value={single.role}
              onChange={(role) => onEdit((r) => updatePosition(r, single.id, { role }))}
            />
          ) : (
            <TextField
              key="location"
              label="Location"
              placeholder="e.g. London, UK"
              value={entry.location}
              onChange={(location) => onEdit((r) => updateExperienceEntry(r, entry.id, { location }))}
            />
          )}
        </div>
        {single ? (
          <>
            <TextField
              label="Location"
              placeholder="e.g. London, UK"
              value={entry.location}
              onChange={(location) => onEdit((r) => updateExperienceEntry(r, entry.id, { location }))}
            />
            <DatesFields
              entryId={single.id}
              dates={single.dates}
              currentLabel={currentLabel("experience")}
              onEdit={onEdit}
            />
            <BulletsFields entryId={single.id} bullets={single.bullets} onEdit={onEdit} />
          </>
        ) : (
          <>
            <div role="group" aria-labelledby={positionsLabelId} className="flex flex-col gap-1.5">
              <span id={positionsLabelId} className="text-xs font-medium text-ink-muted">
                Positions
              </span>
              <ul className="flex flex-col gap-2">
                {positions.map((position, index) => (
                  <PositionCard
                    key={position.id}
                    position={position}
                    name={position.role.trim() ? `${position.role.trim()} position` : `Position ${index + 1}`}
                    expanded={position.id === openId}
                    onToggle={() => setOpenId(position.id === openId ? null : position.id)}
                    onDelete={() => remove(position.id)}
                    isNew={position.id === addedId}
                    onEdit={onEdit}
                  />
                ))}
              </ul>
            </div>
            {positionsOutOfOrder(positions) && (
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" onClick={sort} className="shrink-0">
                  <ArrowDownUp aria-hidden="true" />
                  Sort by date
                </Button>
                <p className="text-xs text-ink-meta">
                  These positions aren&apos;t in date order. Sort them so the most recent one is at the top.
                </p>
              </div>
            )}
          </>
        )}
        <div className="flex items-center gap-3 border-t border-line-soft pt-4">
          <AddEntryButton ref={addButtonRef} onClick={add}>
            Add position
          </AddEntryButton>
          {single && <span className="text-xs text-ink-meta">Promoted, or changed roles at the same company?</span>}
        </div>
      </div>
      <LiveMessage message={announcement} />
    </EntryCard>
  );
}
