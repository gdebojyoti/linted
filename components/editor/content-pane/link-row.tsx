import { useState } from "react";
import { Trash2 } from "lucide-react";
import type { ContactEntry } from "@/lib/resume/types";
import type { ContactChanges } from "@/lib/resume/update-contact";
import { linkHref } from "@/lib/format/link-href";
import { TextField } from "@/components/common/text-field";
import { Button } from "@/components/ui/button";
import { EntryRow } from "./entry-row";

type LinkContact = Extract<ContactEntry, { kind: "link" }>;

/**
 * A link in the Header. The URL box keeps what the user typed, even when the
 * Resume module saves a broken link as empty, and explains why once the user
 * leaves the box.
 */
export function LinkRow({
  entry,
  onUpdate,
  onEnabledChange,
  onDelete,
  autoFocus,
}: {
  entry: LinkContact;
  onUpdate: (changes: ContactChanges) => void;
  onEnabledChange: (enabled: boolean) => void;
  onDelete: () => void;
  autoFocus?: boolean;
}) {
  const [url, setUrl] = useState(entry.value);
  const [left, setLeft] = useState(false);
  const broken = url.trim() !== "" && linkHref(url) === null;
  const label = entry.label.trim();
  const name = label ? `${label} link` : "Link";

  return (
    <EntryRow
      name={name}
      enabled={entry.enabled}
      onEnabledChange={onEnabledChange}
      action={
        <Button variant="ghost" size="icon" onClick={onDelete} aria-label={label ? `Delete ${label} link` : "Delete link"}>
          <Trash2 aria-hidden="true" />
        </Button>
      }
    >
      <TextField
        label="Label"
        placeholder="e.g. GitHub"
        value={entry.label}
        onChange={(label) => onUpdate({ label })}
        autoFocus={autoFocus}
      />
      <TextField
        label="URL"
        type="url"
        placeholder="https://"
        value={url}
        onChange={(value) => {
          setUrl(value);
          onUpdate({ value });
        }}
        onBlur={() => setLeft(true)}
        error={left && broken ? "Start with http://, https:// or mailto:" : undefined}
      />
    </EntryRow>
  );
}
