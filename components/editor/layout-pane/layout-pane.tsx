import { Info, RotateCcw } from "lucide-react";
import { useState } from "react";
import { LiveMessage } from "@/components/common/live-message";
import { Notice } from "@/components/common/notice";
import { Button } from "@/components/ui/button";
import type { DropSide } from "@/components/common/drag/use-reorderable";
import { useTheme } from "@/components/editor/theme/use-theme";
import {
  canMoveSection,
  canPlaceSection,
  isPinned,
  layoutOf,
  moveSection,
  placeSection,
  placementBeside,
  positionInZone,
  resetLayout,
  sectionZone,
  type MoveDirection,
  type Placement,
} from "@/lib/resume/layout";
import type { Resume, ResumeEdit } from "@/lib/resume/types";
import { PinnedRow } from "./pinned-row";
import { SectionChip } from "./section-chip";

/** What was last done, to read out: a move or a drop, worded from the Resume as it now is, or a fixed message. */
type LastAction =
  | { kind: "move"; sectionId: string; direction: MoveDirection }
  | { kind: "drop"; sectionId: string }
  | { kind: "message"; message: string }
  | null;

/**
 * The Layout tab: the Resume's Sections as chips, in Layout order, for its
 * Theme (ADR 0006). Moves are saved in the Resume's Theme Settings, so the
 * preview follows them. A chip's arrows show on hover or keyboard focus,
 * with nothing to select first.
 *
 * Chips are dragged, with a marker showing where they'll land, or moved
 * with their arrows, the keyboard path.
 *
 * Ledger has one column, so its Zones show as one list, the Pinned Header
 * first, and chips are dropped only within their own Zone. A Theme with
 * several columns will show a box per Zone, with drops between them.
 *
 * Each move and reset is read out to screen readers.
 */
export function LayoutPane({ resume, onEdit }: { resume: Resume; onEdit: (edit: ResumeEdit) => void }) {
  const theme = useTheme(resume.themeSettings.themeId);
  const [lastAction, setLastAction] = useState<LastAction>(null);

  if (!theme) {
    return (
      <div className="px-6 pt-32">
        <Notice title="Loading layout…" />
      </div>
    );
  }

  const sectionsById = new Map(resume.content.sections.map((section) => [section.id, section]));
  const layout = layoutOf(resume, theme);
  const sections = theme.zones
    .flatMap((zone) => layout[zone] ?? [])
    .flatMap((id) => sectionsById.get(id) ?? []);

  const announcement = (): string => {
    if (lastAction === null) return "";
    if (lastAction.kind === "message") return lastAction.message;
    const section = sectionsById.get(lastAction.sectionId);
    const place = positionInZone(resume, theme, lastAction.sectionId);
    if (!section || !place) return "";
    const how = lastAction.kind === "drop" ? "dropped" : `moved ${lastAction.direction}`;
    return `${section.title} ${how}, position ${place.position} of ${place.count}.`;
  };

  const move = (sectionId: string, direction: MoveDirection) => {
    onEdit((current) => moveSection(current, theme, sectionId, direction));
    setLastAction({ kind: "move", sectionId, direction });
  };

  /** Where a chip dropped beside the target chip lands. Ledger's single list takes drops only within a chip's own Zone. */
  const placementFor = (sourceId: string, targetId: string, side: DropSide): Placement | null => {
    const placement = placementBeside(resume, theme, targetId, side);
    return placement && placement.zone === sectionZone(resume, theme, sourceId) ? placement : null;
  };

  const accepts = (sourceId: string, targetId: string, side: DropSide) => {
    const placement = placementFor(sourceId, targetId, side);
    return placement !== null && canPlaceSection(resume, theme, sourceId, placement);
  };

  /** Only called once `accepts` has said yes. */
  const drop = (sourceId: string, targetId: string, side: DropSide) => {
    const placement = placementFor(sourceId, targetId, side)!;
    onEdit((current) => placeSection(current, theme, sourceId, placement));
    setLastAction({ kind: "drop", sectionId: sourceId });
  };

  function reset() {
    const saved = resume.themeSettings.layout !== null;
    onEdit((current) => resetLayout(current));
    setLastAction({
      kind: "message",
      message: saved ? "Layout reset to the theme's default." : "The layout is already the theme's default.",
    });
  }

  return (
    <div className="flex grow flex-col gap-4 overflow-auto px-6 pt-5 pb-6">
      <div className="flex flex-col gap-3 rounded-xl border border-line bg-app p-4">
        <div className="-mt-1.5 -mr-1.5 -mb-1 flex justify-end">
          <Button variant="ghost" size="sm" onClick={reset} className="text-[12.5px] text-accent">
            <RotateCcw aria-hidden="true" />
            Reset to theme default
          </Button>
        </div>
        <ul
          aria-label="Sections"
          className="flex flex-col gap-(--chip-gap) rounded-lg [--chip-gap:6px] border border-dashed border-line-input bg-surface p-2.5 focus-within:border-accent/50"
        >
          {sections.map((section) =>
            isPinned(section) ? (
              <PinnedRow key={section.id} section={section} />
            ) : (
              <SectionChip
                key={section.id}
                section={section}
                canMove={(direction) => canMoveSection(resume, theme, section.id, direction)}
                onMove={(direction) => move(section.id, direction)}
                accepts={(sourceId, side) => accepts(sourceId, section.id, side)}
                onDrop={(sourceId, side) => drop(sourceId, section.id, side)}
              />
            ),
          )}
        </ul>
      </div>
      <p className="flex items-start gap-2.5 text-[12.5px] leading-normal text-ink-muted">
        <Info aria-hidden="true" className="mt-px size-4 shrink-0" />
        Drag a section to move it, or point to it or Tab to it and use its arrows. Empty and disabled sections can be placed too; they
        won&apos;t appear in your resume.
      </p>
      <LiveMessage message={announcement()} />
    </div>
  );
}
