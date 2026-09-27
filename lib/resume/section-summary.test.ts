import { describe, expect, test } from "vitest";
import { newResume } from "./new-resume";
import { sectionSummary } from "./section-summary";
import type { Resume, Section } from "./types";

/** A new Resume with its Header named and one Summary Entry, Enabled as given. */
function filled({ headerEnabled = true, summaryEnabled = true } = {}): Resume {
  const resume = newResume();
  const fill = (section: Section): Section => {
    if (section.type === "header") return { ...section, name: "Asha Rao", enabled: headerEnabled };
    if (section.type === "summary") {
      return {
        ...section,
        enabled: summaryEnabled,
        entries: [{ id: "s1", enabled: true, text: "Backend engineer." }],
      };
    }
    return section;
  };
  return { ...resume, content: { sections: resume.content.sections.map(fill) } };
}

describe("sectionSummary", () => {
  test("a new Resume has all sections empty", () => {
    expect(sectionSummary(newResume())).toBe("all sections empty");
  });

  test("counts the Sections that will be shown out of all Sections", () => {
    expect(sectionSummary(filled())).toBe("2 of 6 sections");
  });

  test("a Disabled Section isn't counted as shown", () => {
    expect(sectionSummary(filled({ summaryEnabled: false }))).toBe("1 of 6 sections");
  });
});
