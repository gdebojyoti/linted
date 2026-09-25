import type { HeaderSection } from "@/lib/resume/types";
import type { HeaderChanges } from "@/lib/resume/update-header";
import { TextField } from "@/components/common/text-field";

// The Header's own fields. Its title is fixed, so it has no field here.

export function HeaderFields({
  header,
  onChange,
}: {
  header: HeaderSection;
  onChange: (changes: HeaderChanges) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <TextField label="Name" value={header.name} onChange={(name) => onChange({ name })} />
      <TextField
        label="Headline"
        value={header.headline}
        onChange={(headline) => onChange({ headline })}
      />
    </div>
  );
}
