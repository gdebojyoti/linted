import { Info, RotateCcw } from "lucide-react";
import { useState } from "react";
import { Notice } from "@/components/common/notice";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/editor/preview-pane/use-theme";
import { canMoveSection, layoutOf, moveSection, resetLayout, type MoveDirection } from "@/lib/resume/layout";
import type { Resume, ResumeEdit, Section } from "@/lib/resume/types";
import { PinnedRow } from "./pinned-row";
import { SectionChip } from "./section-chip";

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
  const [announcement, setAnnouncement] = useState("");

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

  function move(section: Section, direction: MoveDirection) {
    if (!theme || !canMoveSection(resume, theme, section.id, direction)) return;
    onEdit((current) => moveSection(current, theme, section.id, direction));
    const movedLayout = layoutOf(moveSection(resume, theme, section.id, direction), theme);
    const order = theme.zones.flatMap((zone) => movedLayout[zone] ?? []);
    setAnnouncement(`${section.title} moved ${direction}, position ${order.indexOf(section.id) + 1} of ${order.length}.`);
  }

  function reset() {
    onEdit((current) => resetLayout(current));
    setSelectedId(null);
    setAnnouncement("Layout reset to the theme's default.");
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
            section.type === "header" && section.pinned ? (
              <PinnedRow key={section.id} section={section} />
            ) : (
              <SectionChip
                key={section.id}
                section={section}
                selected={section.id === selectedId}
                onSelect={() => setSelectedId(section.id === selectedId ? null : section.id)}
                canMove={(direction) => canMoveSection(resume, theme, section.id, direction)}
                onMove={(direction) => move(section, direction)}
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
        {announcement}
      </p>
    </div>
  );
}
