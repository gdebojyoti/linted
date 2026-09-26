import { describe, expect, test } from "vitest";
import { addEntry, deleteEntry, setEntryEnabled } from "./entries";
import { renderableView } from "./renderable-view";
import { sampleResume } from "./sample-resume";
import type { Resume, Section } from "./types";

const now = new Date("2026-09-26T12:00:00.000Z");
const newId = () => "new-id";

function sectionOf(resume: Resume, id: string): Section {
  const section = resume.content.sections.find((s) => s.id === id);
  if (!section) throw new Error(`expected Section ${id}`);
  return section;
}

function entryIds(resume: Resume, sectionId: string) {
  return sectionOf(resume, sectionId).entries.map((e) => e.id);
}

describe("addEntry", () => {
  test("adds an Empty, Enabled link at the end of the Header", () => {
    const updated = addEntry(sampleResume, "header", { now, newId });

    expect(sectionOf(updated, "header").entries.at(-1)).toEqual({
      id: "new-id",
      enabled: true,
      kind: "link",
      label: "",
      value: "",
    });
  });

  test("adds an Empty, Enabled Skills Entry at the end", () => {
    const updated = addEntry(sampleResume, "skills", { now, newId });

    expect(sectionOf(updated, "skills").entries.at(-1)).toEqual({
      id: "new-id",
      enabled: true,
      label: "",
      skills: "",
    });
  });

  test("the new Entry is Empty in every Section type, so the preview doesn't change", () => {
    for (const section of sampleResume.content.sections) {
      const updated = addEntry(sampleResume, section.id, { now, newId });

      expect(entryIds(updated, section.id)).toEqual([...entryIds(sampleResume, section.id), "new-id"]);
      expect(renderableView(updated)).toEqual(renderableView(sampleResume));
    }
  });

  test("updates last-edited-at", () => {
    const updated = addEntry(sampleResume, "skills", { now, newId });

    expect(updated.metadata.lastEditedAt).toBe("2026-09-26T12:00:00.000Z");
  });

  test("an unknown Section id changes nothing", () => {
    expect(addEntry(sampleResume, "no-such-section", { now, newId })).toBe(sampleResume);
  });
});

describe("deleteEntry", () => {
  test("deletes a link, leaving the other contact items", () => {
    const updated = deleteEntry(sampleResume, "header", "contact-github", { now });

    expect(entryIds(updated, "header")).toEqual([
      "contact-email",
      "contact-phone",
      "contact-location",
      "contact-linkedin",
      "contact-blog",
    ]);
    expect(updated.metadata.lastEditedAt).toBe("2026-09-26T12:00:00.000Z");
  });

  test("deletes a Skills Entry", () => {
    const updated = deleteEntry(sampleResume, "skills", "skills-infra", { now });

    expect(entryIds(updated, "skills")).toEqual(["skills-languages", "skills-frontend"]);
  });

  test("the email, phone and location items can't be deleted", () => {
    for (const id of ["contact-email", "contact-phone", "contact-location"]) {
      expect(deleteEntry(sampleResume, "header", id, { now })).toBe(sampleResume);
    }
  });

  test("an unknown Entry id changes nothing", () => {
    expect(deleteEntry(sampleResume, "skills", "no-such-entry", { now })).toBe(sampleResume);
  });
});

describe("setEntryEnabled", () => {
  test("Disables and Enables an Entry, leaving its fields and the other Entries as they were", () => {
    const disabled = setEntryEnabled(sampleResume, "header", "contact-email", false, { now });
    const enabled = setEntryEnabled(disabled, "header", "contact-email", true, { now });

    expect(sectionOf(disabled, "header").entries[0]).toMatchObject({
      enabled: false,
      value: "maya.okafor@example.com",
    });
    expect(sectionOf(enabled, "header").entries).toEqual(sectionOf(sampleResume, "header").entries);
    expect(disabled.metadata.lastEditedAt).toBe("2026-09-26T12:00:00.000Z");
  });

  test("an unknown Entry id changes nothing", () => {
    expect(setEntryEnabled(sampleResume, "skills", "no-such-entry", false, { now })).toBe(sampleResume);
  });
});

test("the Resume passed in is never changed", () => {
  const before = structuredClone(sampleResume);

  addEntry(sampleResume, "skills", { now, newId });
  deleteEntry(sampleResume, "header", "contact-github", { now });
  setEntryEnabled(sampleResume, "header", "contact-email", false, { now });

  expect(sampleResume).toEqual(before);
});
