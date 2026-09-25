import { formatDateRange } from "@/lib/format/date-range";
import type { Rendered } from "@/lib/resume/renderable-view";
import type { ExperienceEntry as StoredExperienceEntry } from "@/lib/resume/types";
import { BulletList } from "./bullet-list";
import { EntryLine } from "./entry-line";
import styles from "./ledger.module.css";
import { meta } from "./meta";

// "Senior Backend Engineer, Paystream        London · Mar 2022 – Present"
export function ExperienceEntry({ entry }: { entry: Rendered<StoredExperienceEntry> }) {
  return (
    <div className={styles.entry}>
      <EntryLine
        strong={entry.role}
        rest={entry.company}
        separator=", "
        meta={meta(entry.location, formatDateRange(entry.dates))}
      />
      <BulletList bullets={entry.bullets} />
    </div>
  );
}
