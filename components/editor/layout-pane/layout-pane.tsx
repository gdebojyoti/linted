import { Info, RotateCcw } from "lucide-react";
import { useRef, useState } from "react";
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
  type Placement,
  type SectionMoveDirection,
} from "@/lib/resume/layout";
import type { Resume, ResumeEdit, Zone } from "@/lib/resume/types";
import { PinnedRow } from "./pinned-row";
import { SectionChip } from "./section-chip";
import { ZoneBoard } from "./zone-board";
import { ZONE_WORDS, zonePlace } from "./zone-words";

/**
 * What was last done, to read out: a move or a drop, worded from the Resume
 * as it now is and the Zone the Section left, or a fixed message.
 */
type LastAction =
  | { kind: "move"; sectionId: string; direction: SectionMoveDirection; from: Zone | null }
  | { kind: "drop"; sectionId: string; from: Zone | null }
  | { kind: "message"; message: string }
  | null;

/** The arrow to focus after a move: the same one, or after left or right (now hidden), the one back. */
const FOCUS_AFTER: Record<SectionMoveDirection, SectionMoveDirection> = {
  up: "up",
  down: "down",
  left: "right",
  right: "left",
};

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
 * first, and chips are dropped only within their own Zone. Margin shows a
 * box per Zone (the top Zone, then the sidebar beside main), and chips are
 * dropped and moved between them (#108).
 *
 * Each move and reset is read out to screen readers, naming the Zone when a
 * Section moves into another.
 */
export function LayoutPane({ resume, onEdit }: { resume: Resume; onEdit: (edit: ResumeEdit) => void }) {
  const theme = useTheme(resume.themeSettings.themeId);
  const [lastAction, setLastAction] = useState<LastAction>(null);
  /** The chip just moved by an arrow, and the arrow it should focus once it's drawn again. */
  const focusAfterMove = useRef<{ sectionId: string; direction: SectionMoveDirection } | null>(null);

  if (!theme) {
    return (
      <div className="px-6 pt-32">
        <Notice title="Loading layout…" />
      </div>
    );
  }

  const columns = theme.arrangement.kind === "top-sidebar-main" ? theme.arrangement : null;
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
    const zone = sectionZone(resume, theme, lastAction.sectionId);
    if (!section || !place || !zone) return "";
    const into = zone === lastAction.from ? null : zonePlace(theme.arrangement, zone);
    const how =
      lastAction.kind === "drop"
        ? into ? `dropped in ${ZONE_WORDS[into].into}` : "dropped"
        : into ? `moved to ${ZONE_WORDS[into].into}` : `moved ${lastAction.direction}`;
    return `${section.title} ${how}, position ${place.position} of ${place.count}.`;
  };

  const move = (sectionId: string, direction: SectionMoveDirection) => {
    focusAfterMove.current = { sectionId, direction: FOCUS_AFTER[direction] };
    setLastAction({ kind: "move", sectionId, direction, from: sectionZone(resume, theme, sectionId) });
    onEdit((current) => moveSection(current, theme, sectionId, direction));
  };

  /** The arrow this chip should focus, once, if an arrow just moved it. */
  const takeFocus = (sectionId: string): SectionMoveDirection | null => {
    const pending = focusAfterMove.current;
    if (pending?.sectionId !== sectionId) return null;
    focusAfterMove.current = null;
    return pending.direction;
  };

  const place = (sourceId: string, placement: Placement) => {
    setLastAction({ kind: "drop", sectionId: sourceId, from: sectionZone(resume, theme, sourceId) });
    onEdit((current) => placeSection(current, theme, sourceId, placement));
  };

  /** Where a chip dropped beside the target chip lands. Ledger's single list takes drops only within a chip's own Zone. */
  const placementFor = (sourceId: string, targetId: string, side: DropSide): Placement | null => {
    const placement = placementBeside(resume, theme, targetId, side);
    if (!placement) return null;
    return columns || placement.zone === sectionZone(resume, theme, sourceId) ? placement : null;
  };

  const accepts = (sourceId: string, targetId: string, side: DropSide) => {
    const placement = placementFor(sourceId, targetId, side);
    return placement !== null && canPlaceSection(resume, theme, sourceId, placement);
  };

  /** Only called once `accepts` has said yes. */
  const drop = (sourceId: string, targetId: string, side: DropSide) => place(sourceId, placementFor(sourceId, targetId, side)!);

  /** A drop in a Zone box's empty space lands at the Zone's end. */
  const endOf = (zone: Zone): Placement => ({ zone, index: (layout[zone] ?? []).length });

  function reset() {
    const saved = resume.themeSettings.layout !== null;
    onEdit((current) => resetLayout(current));
    setLastAction({
      kind: "message",
      message: saved ? "Layout reset to the theme's default." : "The layout is already the theme's default.",
    });
  }

  const item = (sectionId: string) => {
    const section = sectionsById.get(sectionId);
    if (!section) return null;
    return isPinned(section) ? (
      <PinnedRow key={section.id} section={section} />
    ) : (
      <SectionChip
        key={section.id}
        section={section}
        canMove={(direction) => canMoveSection(resume, theme, section.id, direction)}
        onMove={(direction) => move(section.id, direction)}
        takeFocus={() => takeFocus(section.id)}
        accepts={(sourceId, side) => accepts(sourceId, section.id, side)}
        onDrop={(sourceId, side) => drop(sourceId, section.id, side)}
      />
    );
  };

  return (
    <div className="flex grow flex-col gap-4 overflow-auto px-6 pt-5 pb-6">
      <div className="flex flex-col gap-3 rounded-xl border border-line bg-app p-4">
        <div className="-mt-1.5 -mr-1.5 -mb-1 flex justify-end">
          <Button variant="ghost" size="sm" onClick={reset} className="text-[12.5px] text-accent">
            <RotateCcw aria-hidden="true" />
            Reset to theme default
          </Button>
        </div>
        {columns ? (
          <ZoneBoard
            arrangement={columns}
            layout={layout}
            item={item}
            accepts={(zone, sourceId) => canPlaceSection(resume, theme, sourceId, endOf(zone))}
            onDrop={(zone, sourceId) => place(sourceId, endOf(zone))}
          />
        ) : (
          <ul
            aria-label="Sections"
            className="flex flex-col gap-(--chip-gap) rounded-lg [--chip-gap:6px] border border-dashed border-line-input bg-surface p-2.5 focus-within:border-accent/50"
          >
            {sections.map((section) => item(section.id))}
          </ul>
        )}
      </div>
      <p className="flex items-start gap-2.5 text-[12.5px] leading-normal text-ink-muted">
        <Info aria-hidden="true" className="mt-px size-4 shrink-0" />
        Drag a section to move it, or point to it or Tab to it and use its arrows. Empty and disabled sections can be placed too; they
        won&apos;t appear in your resume. Switching theme resets this layout to the new theme&apos;s default.
      </p>
      <LiveMessage message={announcement()} />
    </div>
  );
}
