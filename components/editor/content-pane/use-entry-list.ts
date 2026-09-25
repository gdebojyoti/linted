import { useRef, useState } from "react";
import type { Resume } from "@/lib/resume/types";
import { addEntry, deleteEntry, setEntryEnabled } from "@/lib/resume/entries";

/**
 * Adding, deleting and Enabling/Disabling a Section's Entries. A new Entry
 * gets focus (its row checks `addedId`), and after a delete focus moves to
 * the add button (`addButtonRef`), so keyboard users don't lose their place.
 */
export function useEntryList(sectionId: string, onEdit: (edit: (resume: Resume) => Resume) => void) {
  const [addedId, setAddedId] = useState<string | null>(null);
  const addButtonRef = useRef<HTMLButtonElement>(null);

  return {
    addedId,
    addButtonRef,
    add() {
      const id = crypto.randomUUID();
      onEdit((resume) => addEntry(resume, sectionId, { newId: () => id }));
      setAddedId(id);
    },
    remove(entryId: string) {
      onEdit((resume) => deleteEntry(resume, sectionId, entryId));
      addButtonRef.current?.focus();
    },
    setEnabled(entryId: string, enabled: boolean) {
      onEdit((resume) => setEntryEnabled(resume, sectionId, entryId, enabled));
    },
  };
}
