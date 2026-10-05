import { Plus } from "lucide-react";
import { useRef, useState, type ReactNode } from "react";
import type { CustomSection, ResumeEdit, Section } from "@/lib/resume/types";
import { formatCount } from "@/lib/format/count";
import { addCustomSection, deleteSection, hasContent, renameSection, setSectionEnabled } from "@/lib/resume/sections";
import { ConfirmDeleteDialog } from "@/components/common/confirm-delete-dialog";
import { Button } from "@/components/ui/button";
import { CustomEntryCard } from "./custom-entry-card";
import { EducationEntryCard } from "./education-entry-card";
import { EntryCardList } from "./entry-card-list";
import { ExperienceEntryCard } from "./experience-entry-card";
import { HeaderFields } from "./header-fields";
import { ProjectEntryCard } from "./project-entry-card";
import { SectionRow } from "./section-row";
import { SkillsFields } from "./skills-fields";
import { SummaryFields } from "./summary-fields";

/**
 * The Resume's Sections, one open at a time: opening one closes the others.
 * The Header starts open. Custom Sections are added with the button under
 * them all.
 */
export function ContentPane({
  sections,
  onEdit,
}: {
  sections: Section[];
  onEdit: (edit: ResumeEdit) => void;
}) {
  const [openId, setOpenId] = useState(() => sections.find((s) => s.type === "header")?.id ?? null);
  const [addedId, setAddedId] = useState<string | null>(null);
  const addSectionRef = useRef<HTMLButtonElement>(null);
  const [toDelete, setToDelete] = useState<CustomSection | null>(null);
  const [confirming, setConfirming] = useState(false);
  /** The delete button that asked, and whether the delete went ahead: where focus goes after the dialog. */
  const openerRef = useRef<HTMLElement | null>(null);
  const deletedRef = useRef(false);

  /** Adds a Custom Section, opens it, and puts its title straight into the rename field. */
  function addSection() {
    const id = crypto.randomUUID();
    onEdit((r) => addCustomSection(r, { newId: () => id }));
    setAddedId(id);
    setOpenId(id);
  }

  /**
   * Deletes a Custom Section, asking first if anything in it is filled in.
   * Focus then goes to "Add custom section", or back to the delete button if
   * the user cancels.
   */
  function requestDelete(section: CustomSection, opener: HTMLElement) {
    if (!hasContent(section)) {
      onEdit((r) => deleteSection(r, section.id));
      addSectionRef.current?.focus();
      return;
    }
    openerRef.current = opener;
    deletedRef.current = false;
    setToDelete(section);
    setConfirming(true);
  }

  function confirmDelete() {
    if (!toDelete) return;
    deletedRef.current = true;
    onEdit((r) => deleteSection(r, toDelete.id));
    setConfirming(false);
  }

  function fieldsOf(section: Section): ReactNode {
    switch (section.type) {
      case "header":
        return <HeaderFields header={section} onEdit={onEdit} />;
      case "summary":
        return <SummaryFields section={section} onEdit={onEdit} />;
      case "experience":
        return (
          <EntryCardList
            section={section}
            onEdit={onEdit}
            card={(entry, props) => <ExperienceEntryCard entry={entry} onEdit={onEdit} {...props} />}
          />
        );
      case "projects":
        return (
          <EntryCardList
            section={section}
            onEdit={onEdit}
            card={(entry, props) => <ProjectEntryCard entry={entry} onEdit={onEdit} {...props} />}
          />
        );
      case "skills":
        return <SkillsFields section={section} onEdit={onEdit} />;
      case "education":
        return (
          <EntryCardList
            section={section}
            onEdit={onEdit}
            card={(entry, props) => <EducationEntryCard entry={entry} onEdit={onEdit} {...props} />}
          />
        );
      case "custom":
        return (
          <EntryCardList
            section={section}
            onEdit={onEdit}
            card={(entry, props) => <CustomEntryCard entry={entry} onEdit={onEdit} {...props} />}
          />
        );
    }
  }

  return (
    <aside
      aria-label="Content"
      className="flex min-w-100 max-w-160 w-1/3 shrink-0 flex-col border-r border-line bg-surface"
    >
      <div className="flex h-11 shrink-0 items-center gap-2.5 border-b border-line-soft px-6">
        <span className="text-[13px] font-semibold">Content</span>
        <span className="text-xs text-ink-meta">{formatCount(sections.length, "section", "sections")}</span>
      </div>
      <div className="flex grow flex-col gap-2 overflow-auto px-6 pt-4 pb-8">
        <ul className="flex flex-col gap-2">
          {sections.map((section) => (
            <SectionRow
              key={section.id}
              section={section}
              onEnabledChange={(enabled) => onEdit((r) => setSectionEnabled(r, section.id, enabled))}
              onRename={
                section.type === "header" ? undefined : (title) => onEdit((r) => renameSection(r, section.id, title))
              }
              onDelete={section.type === "custom" ? (opener) => requestDelete(section, opener) : undefined}
              isNew={section.id === addedId}
              expanded={section.id === openId}
              onToggle={() => setOpenId(section.id === openId ? null : section.id)}
            >
              {fieldsOf(section)}
            </SectionRow>
          ))}
        </ul>
        <Button
          ref={addSectionRef}
          variant="outline"
          onClick={addSection}
          className="h-12 w-full shrink-0 border-dashed bg-transparent text-[13px] font-medium"
        >
          <Plus aria-hidden="true" />
          Add custom section
        </Button>
      </div>
      <ConfirmDeleteDialog
        open={confirming}
        onOpenChange={setConfirming}
        heading="Delete section?"
        message={
          <>
            &ldquo;{toDelete?.title}&rdquo; and everything in it will be deleted. This can&apos;t be undone.
          </>
        }
        action="Delete section"
        onConfirm={confirmDelete}
        returnFocusTo={() => (deletedRef.current ? addSectionRef.current : openerRef.current)}
      />
    </aside>
  );
}
