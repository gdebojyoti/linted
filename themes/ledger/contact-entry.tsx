import type { Rendered } from "@/lib/resume/renderable-view";
import type { ContactEntry as StoredContactEntry } from "@/lib/resume/types";
import { TextLink } from "./text-link";

export function ContactEntry({ entry }: { entry: Rendered<StoredContactEntry> }) {
  if (entry.kind !== "link") return <>{entry.value}</>;
  return <TextLink url={entry.value}>{entry.label || entry.value}</TextLink>;
}
