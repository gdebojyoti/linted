import { useState } from "react";
import { linkHref } from "@/lib/format/link-href";
import { TextField } from "@/components/common/text-field";

/**
 * A link's URL. The box keeps what the user typed, even when the Resume
 * module saves a broken link as empty (the link rule). The error shows only
 * once the user leaves the box, and goes as soon as the link is fixed.
 */
export function LinkField({
  label,
  value,
  onChange,
}: {
  label: string;
  /** The stored link, used only to fill the box at first. */
  value: string;
  onChange: (value: string) => void;
}) {
  const [url, setUrl] = useState(value);
  const [errorShown, setErrorShown] = useState(false);

  return (
    <TextField
      label={label}
      type="url"
      placeholder="https://"
      value={url}
      onChange={(value) => {
        setUrl(value);
        if (!isBroken(value)) setErrorShown(false);
        onChange(value);
      }}
      onBlur={() => setErrorShown(isBroken(url))}
      error={errorShown ? "Start with http://, https:// or mailto:" : undefined}
    />
  );
}

/** Text the link rule would save as empty. Empty text isn't broken, just unfilled. */
function isBroken(url: string): boolean {
  return url.trim() !== "" && linkHref(url) === null;
}
