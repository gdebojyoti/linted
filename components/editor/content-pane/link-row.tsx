import { useState } from "react";
import type { LinkEntry } from "@/lib/resume/types";
import type { ContactChanges } from "@/lib/resume/update-contact";
import { linkHref } from "@/lib/format/link-href";
import { TextField } from "@/components/common/text-field";
import { DeleteEntryButton } from "./delete-entry-button";
import { EntryRow } from "./entry-row";

/**
 * A link in the Header. The URL box keeps what the user typed, even when the
 * Resume module saves a broken link as empty. The error shows only once the
 * user leaves the box, and goes as soon as the link is fixed.
 */
export function LinkRow({
  entry,
  onUpdate,
  onEnabledChange,
  onDelete,
  autoFocus,
}: {
  entry: LinkEntry;
  onUpdate: (changes: ContactChanges) => void;
  onEnabledChange: (enabled: boolean) => void;
  onDelete: () => void;
  autoFocus?: boolean;
}) {
  const [url, setUrl] = useState(entry.value);
  const [errorShown, setErrorShown] = useState(false);
  const label = entry.label.trim();
  const name = label ? `${label} link` : "Link";

  return (
    <EntryRow
      name={name}
      enabled={entry.enabled}
      onEnabledChange={onEnabledChange}
      action={<DeleteEntryButton label={label ? `Delete ${label} link` : "Delete link"} onClick={onDelete} />}
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
          if (!isBroken(value)) setErrorShown(false);
          onUpdate({ value });
        }}
        onBlur={() => setErrorShown(isBroken(url))}
        error={errorShown ? "Start with http://, https:// or mailto:" : undefined}
      />
    </EntryRow>
  );
}

/** Text the link rule would save as empty. Empty text isn't broken, just unfilled. */
function isBroken(url: string): boolean {
  return url.trim() !== "" && linkHref(url) === null;
}
