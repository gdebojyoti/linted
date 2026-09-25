import type { ContactEntry } from "@/lib/resume/types";
import type { ContactChanges } from "@/lib/resume/update-contact";
import { TextField } from "@/components/common/text-field";
import { EntryRow } from "./entry-row";

type FixedContact = Exclude<ContactEntry, { kind: "link" }>;

const fields = {
  email: { label: "Email", type: "email" },
  phone: { label: "Phone", type: "tel" },
  location: { label: "Location", type: "text" },
} as const;

/** An email, phone or location item: always there, so it has no delete button. */
export function ContactRow({
  entry,
  onUpdate,
  onEnabledChange,
}: {
  entry: FixedContact;
  onUpdate: (changes: ContactChanges) => void;
  onEnabledChange: (enabled: boolean) => void;
}) {
  const { label, type } = fields[entry.kind];

  return (
    <EntryRow name={label} enabled={entry.enabled} onEnabledChange={onEnabledChange}>
      <TextField label={label} type={type} value={entry.value} onChange={(value) => onUpdate({ value })} />
    </EntryRow>
  );
}
