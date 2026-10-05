import { describe, expect, test } from "vitest";
import { addEntry } from "./entries";
import { renderableView } from "./renderable-view";
import { sampleResume } from "./sample-resume";
import { addCustomSection, deleteSection, hasContent, renameSection, setSectionEnabled } from "./sections";
import type { CustomEntry, CustomSection, Resume, Section } from "./types";
import { updateCustomEntry } from "./update-custom-entry";

const now = new Date("2026-10-04T12:00:00.000Z");

function sectionOf(resume: Resume, id: string): Section {
  const section = resume.content.sections.find((s) => s.id === id);
  if (!section) throw new Error(`expected Section ${id}`);
  return section;
}

function shownIds(resume: Resume): string[] {
  return renderableView(resume).sections.map((s) => s.id);
}

describe("setSectionEnabled", () => {
  test("Disabling a Section removes it from the preview, leaving the others", () => {
    const updated = setSectionEnabled(sampleResume, "experience", false, { now });

    expect(sectionOf(updated, "experience").enabled).toBe(false);
    expect(shownIds(updated)).toEqual(shownIds(sampleResume).filter((id) => id !== "experience"));
    expect(updated.metadata.lastEditedAt).toBe("2026-10-04T12:00:00.000Z");
  });

  test("Enabling it again brings back what was shown before, Entries' own Enabled state included", () => {
    const disabled = setSectionEnabled(sampleResume, "experience", false, { now });
    const enabled = setSectionEnabled(disabled, "experience", true, { now });

    expect(sectionOf(disabled, "experience").entries).toBe(sectionOf(sampleResume, "experience").entries);
    expect(sectionOf(enabled, "experience")).toEqual(sectionOf(sampleResume, "experience"));
    expect(renderableView(enabled)).toEqual(renderableView(sampleResume));
  });

  test("the Header can be Disabled and Enabled like any other Section", () => {
    const disabled = setSectionEnabled(sampleResume, "header", false, { now });
    const enabled = setSectionEnabled(disabled, "header", true, { now });

    expect(shownIds(disabled)).not.toContain("header");
    expect(renderableView(enabled)).toEqual(renderableView(sampleResume));
  });

  test("setting the state a Section already has changes nothing", () => {
    expect(setSectionEnabled(sampleResume, "experience", true, { now })).toBe(sampleResume);
  });

  test("an unknown Section id changes nothing", () => {
    expect(setSectionEnabled(sampleResume, "no-such-section", false, { now })).toBe(sampleResume);
  });
});

describe("renameSection", () => {
  test("sets the title, trimmed, and the Theme shows it", () => {
    const updated = renameSection(sampleResume, "experience", "  Work History ", { now });

    expect(sectionOf(updated, "experience")).toEqual({
      ...sectionOf(sampleResume, "experience"),
      title: "Work History",
    });
    expect(renderableView(updated).sections.find((s) => s.id === "experience")?.title).toBe("Work History");
    expect(updated.metadata.lastEditedAt).toBe("2026-10-04T12:00:00.000Z");
  });

  test("renames a Custom Section too", () => {
    const updated = renameSection(sampleResume, "custom-talks", "Conference Talks", { now });

    expect(sectionOf(updated, "custom-talks").title).toBe("Conference Talks");
  });

  test("rejects renaming the Header", () => {
    expect(renameSection(sampleResume, "header", "About me", { now })).toBe(sampleResume);
  });

  test("rejects an empty or whitespace-only title", () => {
    expect(renameSection(sampleResume, "experience", "", { now })).toBe(sampleResume);
    expect(renameSection(sampleResume, "experience", " \t ", { now })).toBe(sampleResume);
  });

  test("renaming to the same title isn't an edit", () => {
    expect(renameSection(sampleResume, "experience", " Professional Experience ", { now })).toBe(sampleResume);
  });

  test("an unknown Section id changes nothing", () => {
    expect(renameSection(sampleResume, "no-such-section", "Anything", { now })).toBe(sampleResume);
  });
});

describe("addCustomSection", () => {
  test("adds an Empty, Enabled Custom Section titled \"Untitled Section\" after all the others", () => {
    const updated = addCustomSection(sampleResume, { now, newId: () => "custom-new" });

    expect(updated.content.sections.map((s) => s.id)).toEqual([
      ...sampleResume.content.sections.map((s) => s.id),
      "custom-new",
    ]);
    expect(sectionOf(updated, "custom-new")).toEqual({
      id: "custom-new",
      type: "custom",
      title: "Untitled Section",
      enabled: true,
      entries: [],
    });
    expect(updated.metadata.lastEditedAt).toBe("2026-10-04T12:00:00.000Z");
  });

  test("adds any number, in the order added", () => {
    const first = addCustomSection(sampleResume, { now, newId: () => "custom-1" });
    const second = addCustomSection(first, { now, newId: () => "custom-2" });

    expect(second.content.sections.map((s) => s.id).slice(-2)).toEqual(["custom-1", "custom-2"]);
  });

  test("being Empty, it doesn't change the preview", () => {
    const updated = addCustomSection(sampleResume, { now, newId: () => "custom-new" });

    expect(renderableView(updated)).toEqual(renderableView(sampleResume));
  });

  test("it can be renamed, toggled and given Entries like any other Custom Section", () => {
    let resume = addCustomSection(sampleResume, { now, newId: () => "custom-new" });
    resume = renameSection(resume, "custom-new", "Volunteering", { now });
    resume = addEntry(resume, "custom-new", { now, newId: () => "entry-new" });
    resume = updateCustomEntry(resume, "entry-new", { title: "Code Club mentor" }, { now });

    expect(renderableView(resume).sections.at(-1)).toMatchObject({
      id: "custom-new",
      title: "Volunteering",
      entries: [{ id: "entry-new", title: "Code Club mentor" }],
    });
    expect(shownIds(setSectionEnabled(resume, "custom-new", false, { now }))).not.toContain("custom-new");
  });
});

describe("deleteSection", () => {
  test("deletes a Custom Section, the others keeping their order", () => {
    let resume = addCustomSection(sampleResume, { now, newId: () => "custom-1" });
    resume = addCustomSection(resume, { now, newId: () => "custom-2" });
    const updated = deleteSection(resume, "custom-talks", { now });

    expect(updated.content.sections.map((s) => s.id)).toEqual(
      resume.content.sections.map((s) => s.id).filter((id) => id !== "custom-talks"),
    );
    expect(updated.metadata.lastEditedAt).toBe("2026-10-04T12:00:00.000Z");
  });

  test("rejects deleting a Default Section, the Header included", () => {
    for (const section of sampleResume.content.sections.filter((s) => s.type !== "custom")) {
      expect(deleteSection(sampleResume, section.id, { now })).toBe(sampleResume);
    }
  });

  test("an unknown Section id changes nothing", () => {
    expect(deleteSection(sampleResume, "no-such-section", { now })).toBe(sampleResume);
  });
});

describe("hasContent", () => {
  const emptyEntry: CustomEntry = {
    id: "entry",
    enabled: true,
    title: "",
    subtitle: "",
    dates: { start: null, current: false, end: null },
    bullets: [],
  };

  function custom(...entries: CustomEntry[]): CustomSection {
    return { id: "custom", type: "custom", title: "Talks", enabled: true, entries };
  }

  test("a Custom Section with no Entries, or only Empty ones, has none", () => {
    expect(hasContent(custom())).toBe(false);
    expect(hasContent(custom(emptyEntry, { ...emptyEntry, id: "entry-2", title: "  " }))).toBe(false);
  });

  test.each<[string, Partial<CustomEntry>]>([
    ["a title", { title: "Talk" }],
    ["a subtitle", { subtitle: "GopherCon" }],
    ["dates", { dates: { start: null, current: true, end: null } }],
    ["a Bullet", { bullets: [{ id: "b", enabled: true, text: "Spoke", children: [] }] }],
  ])("an Entry with only %s has some", (_, filled) => {
    expect(hasContent(custom({ ...emptyEntry, ...filled }))).toBe(true);
  });

  test("Disabled Entries and Bullets count, since deleting loses them too", () => {
    const disabledChild = {
      id: "b",
      enabled: true,
      text: "",
      children: [{ id: "b-1", enabled: false, text: "Kept for later", children: [] }],
    };

    expect(hasContent(custom({ ...emptyEntry, enabled: false, title: "Talk" }))).toBe(true);
    expect(hasContent(custom({ ...emptyEntry, bullets: [disabledChild] }))).toBe(true);
  });

  test("an Empty Bullet isn't content", () => {
    const blank = { id: "b", enabled: true, text: " ", children: [] };

    expect(hasContent(custom({ ...emptyEntry, bullets: [blank] }))).toBe(false);
  });
});
