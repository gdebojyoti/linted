import type { Rendered } from "@/lib/resume/renderable-view";
import type { SkillsEntry as StoredSkillsEntry } from "@/lib/resume/types";
import styles from "./ledger.module.css";

// "Languages      Go, Python, SQL, TypeScript"
export function SkillsEntry({ entry }: { entry: Rendered<StoredSkillsEntry> }) {
  return (
    <div className={styles.skillsEntry}>
      <span className={styles.skillsLabel}>{entry.label}</span>
      <span>{entry.skills.map((skill) => skill.name).join(", ")}</span>
    </div>
  );
}
