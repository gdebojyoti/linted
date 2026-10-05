import { Trash2 } from "lucide-react";
import type { Ref } from "react";
import { Button } from "@/components/ui/button";

/**
 * Deletes one Entry or Bullet, or a Custom Section. `label` names the action
 * for screen readers, e.g. "Delete GitHub link".
 */
export function DeleteEntryButton({
  ref,
  label,
  onClick,
}: {
  ref?: Ref<HTMLButtonElement>;
  label: string;
  onClick: () => void;
}) {
  return (
    <Button ref={ref} variant="ghost" size="icon" onClick={onClick} aria-label={label}>
      <Trash2 aria-hidden="true" />
    </Button>
  );
}
