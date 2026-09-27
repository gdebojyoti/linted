import { describe, expect, test } from "vitest";
import { addEntry, setEntryEnabled } from "./entries";
import { newResume } from "./new-resume";
import { entrySummary, sectionSummary } from "./section-summary";
import type { ContactKind, HeaderSection, Resume, Section } from "./types";
import { updateContact } from "./update-contact";
import { updateHeader } from "./update-header";

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
  test("a new Resume shows none of its Sections", () => {
    expect(sectionSummary(newResume())).toBe("0 of 6 sections");
  });

  test("counts the Sections that will be shown out of all Sections", () => {
    expect(sectionSummary(filled())).toBe("2 of 6 sections");
  });

  test("a Disabled Section isn't counted as shown", () => {
    expect(sectionSummary(filled({ summaryEnabled: false }))).toBe("1 of 6 sections");
  });
});

const headerOf = (resume: Resume) =>
  resume.content.sections.find((section): section is HeaderSection => section.type === "header")!;

const sectionOf = (resume: Resume, type: Section["type"]) =>
  resume.content.sections.find((section) => section.type === type)!;

/** The id of the Header's first contact item of this kind. */
const contactId = (resume: Resume, kind: ContactKind) => headerOf(resume).entries.find((e) => e.kind === kind)!.id;

/** A new Resume with its email filled in. */
function withEmail(value = "asha@example.com"): Resume {
  const resume = newResume();
  return updateContact(resume, contactId(resume, "email"), { value });
}

describe("entrySummary", () => {
  test("a new Resume's Header shows none of its contact items, though all are Enabled", () => {
    expect(entrySummary(headerOf(newResume()))).toBe("0 of 3 entries");
  });

  test("counts the contact items that will be shown", () => {
    expect(entrySummary(headerOf(withEmail()))).toBe("1 of 3 entries");
  });

  test("a filled-in but Disabled contact item isn't counted", () => {
    const resume = withEmail();
    const disabled = setEntryEnabled(resume, headerOf(resume).id, contactId(resume, "email"), false);
    expect(entrySummary(headerOf(disabled))).toBe("0 of 3 entries");
  });

  test("a contact item holding only spaces counts as Empty", () => {
    expect(entrySummary(headerOf(withEmail("   ")))).toBe("0 of 3 entries");
  });

  test("an Empty link counts towards the total but not as shown, and a labelled one is shown", () => {
    let resume = withEmail();
    resume = addEntry(resume, headerOf(resume).id, { newId: () => "link-1" });
    expect(entrySummary(headerOf(resume))).toBe("1 of 4 entries");

    resume = updateContact(resume, "link-1", { label: "GitHub" });
    expect(entrySummary(headerOf(resume))).toBe("2 of 4 entries");
  });

  test("the Header's name comes first", () => {
    const resume = updateHeader(withEmail(), { name: "Asha Rao" });
    expect(entrySummary(headerOf(resume))).toBe("Asha Rao · 1 of 3 entries");
  });

  test("disabling the Header doesn't change the count of its items", () => {
    const header = { ...headerOf(withEmail()), enabled: false };
    expect(entrySummary(header)).toBe("1 of 3 entries");
  });

  test("other Sections count all their Entries", () => {
    const resume = newResume();
    expect(entrySummary(sectionOf(resume, "skills"))).toBe("No entries");

    const skillsId = sectionOf(resume, "skills").id;
    const twoEntries = addEntry(addEntry(resume, skillsId), skillsId);
    expect(entrySummary(sectionOf(twoEntries, "skills"))).toBe("2 entries");
  });
});
