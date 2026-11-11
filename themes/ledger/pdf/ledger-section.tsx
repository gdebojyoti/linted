import type { RenderedSection } from "@/lib/resume/renderable-view";
import { CustomEntry } from "./custom-entry";
import { EducationEntry } from "./education-entry";
import { EntryList } from "./entry-list";
import { ExperienceEntry } from "./experience-entry";
import { HeaderSection } from "./header-section";
import { ProjectEntry } from "./project-entry";
import { SkillsEntry } from "./skills-entry";
import { styles } from "./styles";
import { SummarySection } from "./summary-section";

/** One Section, `spaceBefore` pt below the one above it. */
export function LedgerSection({
  section,
  spaceBefore,
}: {
  section: RenderedSection;
  spaceBefore: number;
}) {
  switch (section.type) {
    case "header":
      return <HeaderSection header={section} spaceBefore={spaceBefore} />;
    case "summary":
      return <SummarySection section={section} spaceBefore={spaceBefore} />;
    case "skills":
      return (
        <EntryList section={section} Entry={SkillsEntry} style={styles.skills} spaceBefore={spaceBefore} />
      );
    case "experience":
      return <EntryList section={section} Entry={ExperienceEntry} spaceBefore={spaceBefore} />;
    case "projects":
      return <EntryList section={section} Entry={ProjectEntry} spaceBefore={spaceBefore} />;
    case "education":
      return <EntryList section={section} Entry={EducationEntry} spaceBefore={spaceBefore} />;
    case "custom":
      return <EntryList section={section} Entry={CustomEntry} spaceBefore={spaceBefore} />;
  }
}
