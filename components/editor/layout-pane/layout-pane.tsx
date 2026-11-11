import { Info, RotateCcw } from "lucide-react";
import { useState } from "react";
import { Notice } from "@/components/common/notice";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/editor/theme/use-theme";
import {
  canMoveSection,
  isPinned,
  layoutOf,
  moveSection,
  positionInZone,
  resetLayout,
  type MoveDirection,
} from "@/lib/resume/layout";
import type { Resume, ResumeEdit } from "@/lib/resume/types";
import { PinnedRow } from "./pinned-row";
import { SectionChip } from "./section-chip";

/** What was last done, to read out: a move, worded from the Resume as it now is, or a fixed message. */
type LastAction = { sectionId: string; direction: MoveDirection } | { message: string } | null;

/**
 * The Layout tab: the Resume's Sections as chips, in Layout order, for its
 * Theme (ADR 0006). Moves are saved in the Resume's Theme Settings, so the
 * preview follows them; selecting a chip changes nothing in the preview.
 *
 * Ledger has one column, so its Zones show as one list, the Pinned Header
 * first. Moves stay within a Zone. A Theme with several columns will show a
 * box per Zone, with moves between them.
 *
 * Each move and reset is read out to screen readers.
 */
export function LayoutPane({ resume, onEdit }: { resume: Resume; onEdit: (edit: ResumeEdit) => void }) {
  const theme = useTheme(resume.themeSettings.themeId);
  const [selectedId, setSelectedId] = useState<string | null>(null);
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
    if ("message" in lastAction) return lastAction.message;
    const section = sectionsById.get(lastAction.sectionId);
    const place = positionInZone(resume, theme, lastAction.sectionId);
    if (!section || !place) return "";
    return `${section.title} moved ${lastAction.direction}, position ${place.position} of ${place.count}.`;
  };

  const move = (sectionId: string, direction: MoveDirection) => {
    onEdit((current) => moveSection(current, theme, sectionId, direction));
    setLastAction({ sectionId, direction });
  };

  function reset() {
    const saved = resume.themeSettings.layout !== null;
    onEdit((current) => resetLayout(current));
    setSelectedId(null);
    setLastAction({
      message: saved ? "Layout reset to the theme's default." : "The layout is already the theme's default.",
    });
  }

  return (
    <div className="flex grow flex-col gap-4 overflow-auto px-6 pt-5 pb-6">
      <div className="flex flex-col gap-3 rounded-xl border border-line bg-app p-4">
        <div className="-mt-1.5 -mr-1.5 -mb-1 flex justify-end">
          <Button variant="ghost" size="sm" onClick={reset} className="text-[12.5px] text-accent-strong">
            <RotateCcw aria-hidden="true" />
            Reset to theme default
          </Button>
        </div>
        <ul
          aria-label="Sections"
          className={`flex flex-col gap-1.5 rounded-lg border border-dashed bg-surface p-2.5 ${
            selectedId && sectionsById.has(selectedId) ? "border-accent/50" : "border-line-input"
          }`}
        >
          {sections.map((section) =>
            isPinned(section) ? (
              <PinnedRow key={section.id} section={section} />
            ) : (
              <SectionChip
                key={section.id}
                section={section}
                selected={section.id === selectedId}
                onSelect={() => setSelectedId(section.id === selectedId ? null : section.id)}
                canMove={(direction) => canMoveSection(resume, theme, section.id, direction)}
                onMove={(direction) => move(section.id, direction)}
              />
            ),
          )}
        </ul>
      </div>
      <p className="flex items-start gap-2.5 text-[12.5px] leading-normal text-ink-muted">
        <Info aria-hidden="true" className="mt-px size-4 shrink-0" />
        Select a section and use the arrows to move it. Empty and disabled sections can be placed too; they
        won&apos;t appear in your resume.
      </p>
      <p aria-live="polite" className="sr-only">
        {announcement()}
      </p>
    </div>
  );
}
