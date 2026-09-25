import { Plus } from "lucide-react";
import type { Resume, SkillsSection } from "@/lib/resume/types";
import { updateSkillsEntry } from "@/lib/resume/update-skills-entry";
import { Button } from "@/components/ui/button";
import { SkillsEntryRow } from "./skills-entry-row";
import { useEntryList } from "./use-entry-list";

/** The Skills Section's Entries, each a label and a line of Skills. */
export function SkillsFields({
  section,
  onEdit,
}: {
  section: SkillsSection;
  onEdit: (edit: (resume: Resume) => Resume) => void;
}) {
  const { addedId, addButtonRef, add, remove, setEnabled } = useEntryList(section.id, onEdit);

  return (
    <div className="flex flex-col gap-3">
      {section.entries.length > 0 && (
        <ul className="flex flex-col gap-3">
          {section.entries.map((entry) => (
            <SkillsEntryRow
              key={entry.id}
              entry={entry}
              onUpdate={(changes) => onEdit((r) => updateSkillsEntry(r, entry.id, changes))}
              onEnabledChange={(enabled) => setEnabled(entry.id, enabled)}
              onDelete={() => remove(entry.id)}
              autoFocus={entry.id === addedId}
            />
          ))}
        </ul>
      )}
      <Button ref={addButtonRef} variant="outline" size="sm" onClick={add} className="self-start">
        <Plus aria-hidden="true" />
        Add group
      </Button>
    </div>
  );
}
