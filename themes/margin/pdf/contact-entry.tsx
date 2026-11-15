// Copied from Ledger (themes/ledger/pdf/contact-entry.tsx), so each Theme stays independent.
// The copies may drift apart. When you fix one, check whether the other
// needs the same fix.

import type { Rendered } from "@/lib/resume/renderable-view";
import type { ContactEntry as StoredContactEntry } from "@/lib/resume/types";
import { TextLink } from "./text-link";

/** Drawn inside a `<Text>`. */
export function ContactEntry({ entry }: { entry: Rendered<StoredContactEntry> }) {
  if (entry.kind !== "link") return <>{entry.value}</>;
  return <TextLink url={entry.value}>{entry.label || entry.value}</TextLink>;
}
