import { View } from "@react-pdf/renderer";
import type { RenderedSection } from "@/lib/resume/renderable-view";
import { CustomEntry } from "./custom-entry";
import { EducationEntry } from "./education-entry";
import { ExperienceEntry } from "./experience-entry";
import { HeaderSection } from "./header-section";
import { ProjectEntry } from "./project-entry";
import { SectionTitle } from "./section-title";
import { SkillsEntry } from "./skills-entry";
import { styles } from "./styles";
import { SummaryEntry } from "./summary-entry";

/**
 * A Section: its title, then its Entries. The title is handed to the first
 * Entry, which draws it in the same unbreakable group as its own first line,
 * so a title never ends a page.
 */
export function LedgerSection({ section }: { section: RenderedSection }) {
  if (section.type === "header") return <HeaderSection header={section} />;

  // The title goes with the first Entry only. 5pt under it, or 8pt above a
  // list of Entries with lines and Bullets.
  const textHeading = (index: number) =>
    index === 0 ? <SectionTitle title={section.title} spaceAfter={5} /> : undefined;
  const entryHeading = (index: number) =>
    index === 0 ? <SectionTitle title={section.title} spaceAfter={8} /> : undefined;

  switch (section.type) {
    case "summary":
      return (
        <View style={styles.summary}>
          {section.entries.map((entry, i) => (
            <SummaryEntry key={entry.id} entry={entry} heading={textHeading(i)} />
          ))}
        </View>
      );
    case "skills":
      return (
        <View style={styles.skills}>
          {section.entries.map((entry, i) => (
            <SkillsEntry key={entry.id} entry={entry} heading={textHeading(i)} />
          ))}
        </View>
      );
    case "experience":
      return (
        <View style={styles.entries}>
          {section.entries.map((entry, i) => (
            <ExperienceEntry key={entry.id} entry={entry} heading={entryHeading(i)} />
          ))}
        </View>
      );
    case "projects":
      return (
        <View style={styles.entries}>
          {section.entries.map((entry, i) => (
            <ProjectEntry key={entry.id} entry={entry} heading={entryHeading(i)} />
          ))}
        </View>
      );
    case "education":
      return (
        <View style={styles.entries}>
          {section.entries.map((entry, i) => (
            <EducationEntry key={entry.id} entry={entry} heading={entryHeading(i)} />
          ))}
        </View>
      );
    case "custom":
      return (
        <View style={styles.entries}>
          {section.entries.map((entry, i) => (
            <CustomEntry key={entry.id} entry={entry} heading={entryHeading(i)} />
          ))}
        </View>
      );
  }
}
