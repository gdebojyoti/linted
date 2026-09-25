import type { Rendered } from "@/lib/resume/renderable-view";
import type { ContactEntry } from "@/lib/resume/types";
import { TextLink } from "./text-link";

export function ContactItem({ entry }: { entry: Rendered<ContactEntry> }) {
  if (entry.kind !== "link") return <>{entry.value}</>;
  return <TextLink url={entry.value}>{entry.label || entry.value}</TextLink>;
}
