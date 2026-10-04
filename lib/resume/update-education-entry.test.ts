import { describe, expect, test } from "vitest";
import { sampleResume } from "./sample-resume";
import type { EducationEntry, Resume } from "./types";
import { updateEducationEntry } from "./update-education-entry";

const now = new Date("2026-10-04T12:00:00.000Z");

function educationEntry(resume: Resume, id: string): EducationEntry {
  const education = resume.content.sections.find((s) => s.type === "education");
  const entry = education?.entries.find((e) => e.id === id);
  if (!entry) throw new Error(`expected Education Entry ${id}`);
  return entry;
}

describe("updateEducationEntry", () => {
  test("sets the institution, degree, location and results exactly as typed", () => {
    const updated = updateEducationEntry(
      sampleResume,
      "edu-manchester",
      {
        institution: "The University of Manchester ",
        degree: "MEng Computer Science",
        location: "UK",
        results: "3.9 GPA",
      },
      { now },
    );

    expect(educationEntry(updated, "edu-manchester")).toEqual({
      ...educationEntry(sampleResume, "edu-manchester"),
      institution: "The University of Manchester ",
      degree: "MEng Computer Science",
      location: "UK",
      results: "3.9 GPA",
    });
    expect(updated.metadata.lastEditedAt).toBe("2026-10-04T12:00:00.000Z");
  });

  test("sets one field, leaving the others, including dates and Bullets", () => {
    const before = educationEntry(sampleResume, "edu-manchester");
    const updated = updateEducationEntry(sampleResume, "edu-manchester", { results: "" }, { now });

    expect(educationEntry(updated, "edu-manchester")).toEqual({ ...before, results: "" });
  });

  test("an unknown Education Entry changes nothing", () => {
    expect(updateEducationEntry(sampleResume, "no-such-entry", { degree: "x" }, { now })).toBe(sampleResume);
  });

  test("an Entry of another Section isn't changed", () => {
    expect(updateEducationEntry(sampleResume, "exp-paystream", { degree: "x" }, { now })).toBe(sampleResume);
  });
});
