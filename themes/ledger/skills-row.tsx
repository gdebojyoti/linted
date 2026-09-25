import type { Rendered } from "@/lib/resume/renderable-view";
import type { SkillsEntry } from "@/lib/resume/types";
import styles from "./ledger.module.css";

// "Languages      Go, Python, SQL, TypeScript"
export function SkillsRow({ entry }: { entry: Rendered<SkillsEntry> }) {
  return (
    <div className={styles.skillsRow}>
      <span className={styles.skillsLabel}>{entry.label}</span>
      <span>{entry.skills.map((skill) => skill.name).join(", ")}</span>
    </div>
  );
}
