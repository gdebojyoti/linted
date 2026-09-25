import type { RenderedSection } from "@/lib/resume/renderable-view";
import { CustomEntry } from "./custom-entry";
import { EducationEntry } from "./education-entry";
import { ExperienceEntry } from "./experience-entry";
import { HeaderSection } from "./header-section";
import styles from "./ledger.module.css";
import { ProjectEntry } from "./project-entry";
import { SkillsEntry } from "./skills-entry";

export function LedgerSection({ section }: { section: RenderedSection }) {
  if (section.type === "header") return <HeaderSection header={section} />;

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{section.title}</h2>
      {section.type === "summary" &&
        // Prose shows as its Markdown source until the Prose renderer (#16).
        section.entries.map((entry) => <p key={entry.id}>{entry.text}</p>)}
      {section.type === "skills" && (
        <div className={styles.skills}>
          {section.entries.map((entry) => (
            <SkillsEntry key={entry.id} entry={entry} />
          ))}
        </div>
      )}
      {section.type === "experience" && (
        <div className={styles.entries}>
          {section.entries.map((entry) => (
            <ExperienceEntry key={entry.id} entry={entry} />
          ))}
        </div>
      )}
      {section.type === "projects" && (
        <div className={styles.entries}>
          {section.entries.map((entry) => (
            <ProjectEntry key={entry.id} entry={entry} />
          ))}
        </div>
      )}
      {section.type === "education" && (
        <div className={styles.entries}>
          {section.entries.map((entry) => (
            <EducationEntry key={entry.id} entry={entry} />
          ))}
        </div>
      )}
      {section.type === "custom" && (
        <div className={styles.entries}>
          {section.entries.map((entry) => (
            <CustomEntry key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </section>
  );
}
