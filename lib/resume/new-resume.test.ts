import { describe, expect, test } from "vitest";
import { newResume } from "./new-resume";
import { renderableView } from "./renderable-view";
import { DEFAULT_RESUME_TITLE, DEFAULT_THEME_ID, SCHEMA_VERSION } from "./types";

const now = new Date("2026-09-24T10:00:00.000Z");

function sequentialIds() {
  let n = 0;
  return () => `id-${++n}`;
}

describe("newResume", () => {
  test("starts with the six Default Sections in order", () => {
    const resume = newResume({ now, newId: sequentialIds() });

    expect(resume.content.sections.map((s) => s.type)).toEqual([
      "header",
      "summary",
      "experience",
      "projects",
      "skills",
      "education",
    ]);
  });

  test("every starting Section is Empty and Enabled", () => {
    const resume = newResume({ now, newId: sequentialIds() });

    expect(resume.content.sections.every((section) => section.enabled)).toBe(true);
    expect(renderableView(resume).sections).toEqual([]);
  });

  test("only the Header starts with Entries: an Empty, Enabled email, phone and location", () => {
    const [header, ...others] = newResume({ now, newId: sequentialIds() }).content.sections;

    expect(header.entries).toEqual([
      { id: expect.any(String), enabled: true, kind: "email", value: "" },
      { id: expect.any(String), enabled: true, kind: "phone", value: "" },
      { id: expect.any(String), enabled: true, kind: "location", value: "" },
    ]);
    for (const section of others) expect(section.entries).toEqual([]);
  });

  test("the Header is Pinned, with an Empty name and headline", () => {
    const [header] = newResume({ now, newId: sequentialIds() }).content.sections;

    expect(header).toMatchObject({
      type: "header",
      pinned: true,
      name: "",
      headline: "",
    });
  });

  test("Sections get their default titles", () => {
    const resume = newResume({ now, newId: sequentialIds() });

    expect(resume.content.sections.map((s) => s.title)).toEqual([
      "Header",
      "Summary",
      "Experience",
      "Projects",
      "Skills",
      "Education",
    ]);
  });

  test("the Resume, each Section and each Entry get distinct ids", () => {
    const resume = newResume({ now, newId: sequentialIds() });
    const ids = [
      resume.metadata.id,
      ...resume.content.sections.flatMap((s) => [s.id, ...s.entries.map((e) => e.id)]),
    ];

    expect(new Set(ids).size).toBe(ids.length);
  });

  test("by default, two new Resumes share no ids", () => {
    const idsOf = (resume: ReturnType<typeof newResume>) => [
      resume.metadata.id,
      ...resume.content.sections.map((s) => s.id),
    ];
    const ids = [...idsOf(newResume()), ...idsOf(newResume())];

    expect(new Set(ids).size).toBe(ids.length);
  });

  test("has the default Resume Title and both timestamps set to now", () => {
    const { metadata } = newResume({ now, newId: sequentialIds() });

    expect(metadata.title).toBe(DEFAULT_RESUME_TITLE);
    expect(metadata.createdAt).toBe("2026-09-24T10:00:00.000Z");
    expect(metadata.lastEditedAt).toBe("2026-09-24T10:00:00.000Z");
  });

  test("carries the current schema version, and the default Theme with its default Layout", () => {
    const resume = newResume({ now, newId: sequentialIds() });

    expect(resume.schemaVersion).toBe(SCHEMA_VERSION);
    expect(resume.themeSettings).toEqual({
      themeId: DEFAULT_THEME_ID,
      layout: null,
    });
  });
});
