import { describe, expect, test } from "vitest";
import { sampleResume } from "./sample-resume";
import type { CustomEntry, Resume } from "./types";
import { updateCustomEntry } from "./update-custom-entry";

const now = new Date("2026-10-04T12:00:00.000Z");

function customEntry(resume: Resume, id: string): CustomEntry {
  for (const section of resume.content.sections) {
    if (section.type !== "custom") continue;
    const entry = section.entries.find((e) => e.id === id);
    if (entry) return entry;
  }
  throw new Error(`expected Custom Entry ${id}`);
}

describe("updateCustomEntry", () => {
  test("sets the title and subtitle exactly as typed", () => {
    const updated = updateCustomEntry(
      sampleResume,
      "talk-gophercon",
      { title: "Idempotency at scale ", subtitle: "GopherCon EU" },
      { now },
    );

    expect(customEntry(updated, "talk-gophercon")).toEqual({
      ...customEntry(sampleResume, "talk-gophercon"),
      title: "Idempotency at scale ",
      subtitle: "GopherCon EU",
    });
    expect(customEntry(updated, "talk-meetup")).toEqual(customEntry(sampleResume, "talk-meetup"));
    expect(updated.metadata.lastEditedAt).toBe("2026-10-04T12:00:00.000Z");
  });

  test("sets one field, leaving the others, including dates and Bullets", () => {
    const before = customEntry(sampleResume, "talk-gophercon");
    const updated = updateCustomEntry(sampleResume, "talk-gophercon", { subtitle: "" }, { now });

    expect(customEntry(updated, "talk-gophercon")).toEqual({ ...before, subtitle: "" });
  });

  test("an unknown Custom Entry changes nothing", () => {
    expect(updateCustomEntry(sampleResume, "no-such-entry", { title: "x" }, { now })).toBe(sampleResume);
  });

  test("an Entry of another Section isn't changed", () => {
    expect(updateCustomEntry(sampleResume, "exp-paystream", { title: "x" }, { now })).toBe(sampleResume);
  });
});
