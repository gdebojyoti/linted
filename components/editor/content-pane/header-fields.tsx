import type { HeaderSection } from "@/lib/resume/types";
import type { HeaderChanges } from "@/lib/resume/update-header";
import { TextField } from "@/components/common/text-field";

// The Header's own fields. The Header can't be renamed, so it has no title field.

export function HeaderFields({
  header,
  onUpdate,
}: {
  header: HeaderSection;
  onUpdate: (changes: HeaderChanges) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <TextField label="Name" value={header.name} onChange={(name) => onUpdate({ name })} />
      <TextField
        label="Headline"
        value={header.headline}
        onChange={(headline) => onUpdate({ headline })}
      />
    </div>
  );
}
