import { describe, expect, test } from "vitest";
import { copyTitle, duplicateResume } from "./duplicate-resume";
import { addEntry } from "./entries";
import { renderableView } from "./renderable-view";
import { sampleResume } from "./sample-resume";
import type { Bullet, Resume } from "./types";
import { updateContact } from "./update-contact";
import { updateHeader } from "./update-header";

const now = new Date("2026-09-28T12:00:00.000Z");

/** Every id in the Resume: its own, and every Section's, Entry's and Bullet's. */
function allIds(resume: Resume): string[] {
  const bulletIds = (bullets: Bullet[]): string[] => bullets.flatMap((b) => [b.id, ...bulletIds(b.children)]);
  return [
    resume.metadata.id,
    ...resume.content.sections.flatMap((section) => [
      section.id,
      ...section.entries.flatMap((entry) => [entry.id, ...("bullets" in entry ? bulletIds(entry.bullets) : [])]),
    ]),
  ];
}

const header = (resume: Resume) => resume.content.sections.find((s) => s.type === "header")!;

/**
 * Changes, in place, every object nested in the Resume's Content: each
 * Section, Entry, date range and Bullet at every depth. If a copy shared any
 * of them with its original, the original would change too.
 */
function scribbleOver(resume: Resume) {
  const scribbleBullets = (bullets: Bullet[]) =>
    bullets.forEach((bullet) => {
      bullet.text = "scribbled";
      scribbleBullets(bullet.children);
    });

  for (const section of resume.content.sections) {
    section.title = "scribbled";
    for (const entry of section.entries) {
      entry.enabled = !entry.enabled;
      if ("dates" in entry) entry.dates.start = { year: 1900, month: null, day: null };
      if ("bullets" in entry) scribbleBullets(entry.bullets);
    }
  }
}

describe("duplicateResume", () => {
  test("gives the copy a new id for the Resume and every Section, Entry and Bullet", () => {
    const copy = duplicateResume(sampleResume, { now });
    const original = new Set(allIds(sampleResume));

    expect(allIds(copy)).toHaveLength(original.size);
    expect(allIds(copy).filter((id) => original.has(id))).toEqual([]);
    expect(new Set(allIds(copy)).size).toBe(original.size);
  });

  test("keeps all the Content, Enabled states included, and the Theme", () => {
    const copy = duplicateResume(sampleResume, { now });

    const withoutIds = (resume: Resume) => JSON.parse(JSON.stringify(resume.content, (key, value) => (key === "id" ? undefined : value)));
    expect(withoutIds(copy)).toEqual(withoutIds(sampleResume));
    expect(renderableView(copy).sections.map((s) => s.title)).toEqual(renderableView(sampleResume).sections.map((s) => s.title));
    expect(copy.themeSettings).toEqual(sampleResume.themeSettings);
  });

  test("titles the copy \"<title> (copy)\" by default", () => {
    expect(duplicateResume(sampleResume, { now }).metadata.title).toBe(`${sampleResume.metadata.title} (copy)`);
    expect(copyTitle("Stripe backend v2")).toBe("Stripe backend v2 (copy)");
  });

  test("takes a title, trimmed, and falls back to the default when it's blank", () => {
    expect(duplicateResume(sampleResume, { now, title: "  Platform v3 " }).metadata.title).toBe("Platform v3");
    expect(duplicateResume(sampleResume, { now, title: "  " }).metadata.title).toBe(copyTitle(sampleResume.metadata.title));
  });

  test("gets fresh created and last-edited times", () => {
    const { createdAt, lastEditedAt } = duplicateResume(sampleResume, { now }).metadata;

    expect(createdAt).toBe("2026-09-28T12:00:00.000Z");
    expect(lastEditedAt).toBe("2026-09-28T12:00:00.000Z");
  });

  test("changing the copy, however deep, never changes the original", () => {
    const original = structuredClone(sampleResume);
    const before = structuredClone(original);

    scribbleOver(duplicateResume(original, { now }));

    expect(original).toEqual(before);
  });

  test("changing the original, however deep, never changes the copy", () => {
    const original = structuredClone(sampleResume);
    const copy = duplicateResume(original, { now });
    const before = structuredClone(copy);

    scribbleOver(original);

    expect(copy).toEqual(before);
  });

  test("an edit through the Resume module changes only the Resume it's made to", () => {
    const copy = duplicateResume(sampleResume, { now });

    const edited = updateHeader(copy, { name: "Someone else" }, { now });

    expect(header(edited).name).toBe("Someone else");
    expect(header(sampleResume).name).not.toBe("Someone else");
  });

  test("the Layout follows the Sections' new ids, and drops ids of Sections that are gone", () => {
    const [header, summary] = sampleResume.content.sections;
    const resume: Resume = {
      ...sampleResume,
      themeSettings: { ...sampleResume.themeSettings, layout: { header: [header.id], main: [summary.id, "gone"] } },
    };

    const copy = duplicateResume(resume, { now });
    const [copyHeader, copySummary] = copy.content.sections;

    expect(copy.themeSettings.layout).toEqual({ header: [copyHeader.id], main: [copySummary.id] });
    expect(resume.themeSettings.layout).toEqual({ header: [header.id], main: [summary.id, "gone"] });
  });

  test("does not change the given Resume", () => {
    const resume = updateContact(addEntry(sampleResume, "header", { now }), "contact-phone", { value: "1" }, { now });
    const before = structuredClone(resume);

    duplicateResume(resume, { now });

    expect(resume).toEqual(before);
  });
});
