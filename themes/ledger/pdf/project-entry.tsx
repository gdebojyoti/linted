import type { ReactNode } from "react";
import { formatDateRange } from "@/lib/format/date-range";
import type { Rendered } from "@/lib/resume/renderable-view";
import type { ProjectEntry as StoredProjectEntry } from "@/lib/resume/types";
import { EntryBlock } from "./entry-block";
import { EntryLine } from "./entry-line";
import { TextLink } from "./text-link";

/**
 * "Ledgerly — Go, Postgres, HTMX        ledgerly.example.com · Jan 2024 – Present"
 *
 * The link reads as its label, or as its URL when it has no label, like a
 * Header link.
 */
export function ProjectEntry({
  entry,
  heading,
}: {
  entry: Rendered<StoredProjectEntry>;
  heading?: ReactNode;
}) {
  const dates = formatDateRange(entry.dates);
  const linkText = entry.linkLabel || entry.link;
  const meta = (linkText || dates) && (
    <>
      {linkText && <TextLink url={entry.link}>{linkText}</TextLink>}
      {linkText && dates && " · "}
      {dates}
    </>
  );

  return (
    <EntryBlock
      heading={heading}
      lines={<EntryLine strong={entry.name} rest={entry.techStack} separator=" — " meta={meta} />}
      bullets={entry.bullets}
    />
  );
}
