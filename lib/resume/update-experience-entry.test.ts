import { describe, expect, test } from "vitest";
import { sampleResume } from "./sample-resume";
import type { ExperienceEntry, Resume } from "./types";
import { updateExperienceEntry } from "./update-experience-entry";

const now = new Date("2026-10-04T12:00:00.000Z");

function experienceEntry(resume: Resume, id: string): ExperienceEntry {
  const experience = resume.content.sections.find((s) => s.type === "experience");
  const entry = experience?.entries.find((e) => e.id === id);
  if (!entry) throw new Error(`expected Experience Entry ${id}`);
  return entry;
}

describe("updateExperienceEntry", () => {
  test("sets the company, role and location exactly as typed", () => {
    const updated = updateExperienceEntry(
      sampleResume,
      "exp-paystream",
      { company: "Paystream Ltd ", role: "Staff Engineer", location: "Remote" },
      { now },
    );

    expect(experienceEntry(updated, "exp-paystream")).toEqual({
      ...experienceEntry(sampleResume, "exp-paystream"),
      company: "Paystream Ltd ",
      role: "Staff Engineer",
      location: "Remote",
    });
    expect(experienceEntry(updated, "exp-northwind")).toEqual(experienceEntry(sampleResume, "exp-northwind"));
    expect(updated.metadata.lastEditedAt).toBe("2026-10-04T12:00:00.000Z");
  });

  test("sets one field, leaving the others, including dates and Bullets", () => {
    const before = experienceEntry(sampleResume, "exp-paystream");
    const updated = updateExperienceEntry(sampleResume, "exp-paystream", { role: "" }, { now });

    expect(experienceEntry(updated, "exp-paystream")).toEqual({ ...before, role: "" });
  });

  test("an unknown Experience Entry changes nothing", () => {
    expect(updateExperienceEntry(sampleResume, "no-such-entry", { company: "x" }, { now })).toBe(sampleResume);
  });

  test("an Entry of another Section isn't changed", () => {
    expect(updateExperienceEntry(sampleResume, "skills-languages", { company: "x" }, { now })).toBe(sampleResume);
  });
});
