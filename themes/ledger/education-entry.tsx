import { formatDateRange } from "@/lib/format/date-range";
import type { Rendered } from "@/lib/resume/renderable-view";
import type { EducationEntry as StoredEducationEntry } from "@/lib/resume/types";
import { BulletList } from "./bullet-list";
import { EntryLine } from "./entry-line";
import styles from "./ledger.module.css";
import { meta } from "./meta";

// "University of Manchester        Manchester · 2013 – 2017"
// "BSc Computer Science            First-class honours"
export function EducationEntry({ entry }: { entry: Rendered<StoredEducationEntry> }) {
  const firstLine = meta(entry.location, formatDateRange(entry.dates));

  return (
    <div className={styles.entry}>
      {(entry.institution || firstLine) && (
        <EntryLine strong={entry.institution} separator="" meta={firstLine} />
      )}
      {(entry.degree || entry.results) && (
        <EntryLine strong="" rest={entry.degree} separator="" meta={entry.results} />
      )}
      <BulletList bullets={entry.bullets} />
    </div>
  );
}
