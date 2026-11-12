import type {
  CustomSection,
  EducationSection,
  ExperienceSection,
  HeaderSection,
  ProjectsSection,
  Section,
} from "@/lib/resume/types";

/** A Section whose Entries can be moved: any but the Header, whose contact items keep a fixed order. */
export type MovableSection = Exclude<Section, HeaderSection>;

/** A Section whose Entries are drawn as cards (EntryCardList). */
export type CardSection = ExperienceSection | ProjectsSection | EducationSection | CustomSection;

/**
 * What an Entry card's header line says it is: its main field (a company,
 * a project's name, an institution, a title) and a second one shown in
 * grey (a role, a tech stack, a degree, a subtitle), both trimmed.
 */
export type EntryHeading = { main: string; detail: string };

export function entryHeading(section: CardSection, index: number): EntryHeading {
  const heading = (main = "", detail = "") => ({ main: main.trim(), detail: detail.trim() });
  switch (section.type) {
    case "experience": {
      const entry = section.entries[index];
      return heading(entry?.company, entry?.role);
    }
    case "projects": {
      const entry = section.entries[index];
      return heading(entry?.name, entry?.techStack);
    }
    case "education": {
      const entry = section.entries[index];
      return heading(entry?.institution, entry?.degree);
    }
    case "custom": {
      const entry = section.entries[index];
      return heading(entry?.title, entry?.subtitle);
    }
  }
}

/**
 * What screen readers call the Entry at this place in its Section: a card
 * by its heading, e.g. "Paystream entry", or "Entry 2" while it has nothing
 * to go by. A Summary Entry is "Summary 1", "Summary 2"…, and a Skills Entry
 * is named by its label, or just "Entry".
 */
export function entryName(section: MovableSection, index: number): string {
  switch (section.type) {
    case "summary":
      return `Summary ${index + 1}`;
    case "skills": {
      const label = section.entries[index]?.label.trim();
      return label ? `${label} entry` : "Entry";
    }
    default: {
      const { main, detail } = entryHeading(section, index);
      const named = main || detail;
      return named ? `${named} entry` : `Entry ${index + 1}`;
    }
  }
}
