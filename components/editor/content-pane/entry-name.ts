import type { HeaderSection, Section } from "@/lib/resume/types";

/** A Section whose Entries can be moved: any but the Header, whose contact items keep a fixed order. */
export type MovableSection = Exclude<Section, HeaderSection>;

/**
 * What screen readers call the Entry at this place in its Section, e.g.
 * "Paystream entry", or "Entry 2" while it has nothing to go by. A Summary
 * Entry is "Summary 1", "Summary 2"…, and a Skills Entry with no label just
 * "Entry".
 */
export function entryName(section: MovableSection, index: number): string {
  const numbered = `Entry ${index + 1}`;
  const named = (...fields: string[]) => {
    const name = fields.map((field) => field.trim()).find(Boolean);
    return name ? `${name} entry` : numbered;
  };
  switch (section.type) {
    case "summary":
      return `Summary ${index + 1}`;
    case "skills": {
      const label = section.entries[index]?.label.trim();
      return label ? `${label} entry` : "Entry";
    }
    case "experience": {
      const entry = section.entries[index];
      return entry ? named(entry.company, entry.role) : numbered;
    }
    case "projects": {
      const entry = section.entries[index];
      return entry ? named(entry.name, entry.techStack) : numbered;
    }
    case "education": {
      const entry = section.entries[index];
      return entry ? named(entry.institution, entry.degree) : numbered;
    }
    case "custom": {
      const entry = section.entries[index];
      return entry ? named(entry.title, entry.subtitle) : numbered;
    }
  }
}
