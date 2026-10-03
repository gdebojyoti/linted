import { formatDateRange } from "@/lib/format/date-range";
import type { Rendered } from "@/lib/resume/renderable-view";
import type { ProjectEntry as StoredProjectEntry } from "@/lib/resume/types";
import { BulletList } from "./bullet-list";
import { EntryLine } from "./entry-line";
import styles from "./ledger.module.css";
import { TextLink } from "./text-link";

/**
 * "Ledgerly — Go, Postgres, HTMX        ledgerly.example.com · Jan 2024 – Present"
 *
 * The link reads as its label, or as its URL when it has no label, like a
 * Header link.
 */
export function ProjectEntry({ entry }: { entry: Rendered<StoredProjectEntry> }) {
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
    <div className={styles.entry}>
      <EntryLine strong={entry.name} rest={entry.techStack} separator=" — " meta={meta} />
      <BulletList bullets={entry.bullets} />
    </div>
  );
}
