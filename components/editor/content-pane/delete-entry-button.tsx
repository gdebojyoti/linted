import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Deletes one Entry. `label` names the action for screen readers, e.g. "Delete GitHub link". */
export function DeleteEntryButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Button variant="ghost" size="icon" onClick={onClick} aria-label={label}>
      <Trash2 aria-hidden="true" />
    </Button>
  );
}
