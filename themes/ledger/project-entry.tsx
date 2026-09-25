import { formatDateRange } from "@/lib/format/date-range";
import type { Rendered } from "@/lib/resume/renderable-view";
import type { ProjectEntry as StoredProjectEntry } from "@/lib/resume/types";
import { BulletList } from "./bullet-list";
import { EntryLine } from "./entry-line";
import styles from "./ledger.module.css";
import { TextLink } from "./text-link";

// "Ledgerly — Go, Postgres, HTMX        ledgerly.example.com · Jan 2024 – Present"
export function ProjectEntry({ entry }: { entry: Rendered<StoredProjectEntry> }) {
  const dates = formatDateRange(entry.dates);
  const meta = (entry.link || dates) && (
    <>
      {entry.link && <TextLink url={entry.link}>{entry.link}</TextLink>}
      {entry.link && dates && " · "}
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
