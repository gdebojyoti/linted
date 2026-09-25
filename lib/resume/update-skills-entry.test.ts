import { describe, expect, test } from "vitest";
import { sampleResume } from "./sample-resume";
import type { Resume, SkillsEntry } from "./types";
import { updateSkillsEntry } from "./update-skills-entry";

const now = new Date("2026-09-26T12:00:00.000Z");

function skillsEntry(resume: Resume, id: string): SkillsEntry {
  const skills = resume.content.sections.find((s) => s.type === "skills");
  const entry = skills?.entries.find((e) => e.id === id);
  if (!entry) throw new Error(`expected Skills Entry ${id}`);
  return entry;
}

describe("updateSkillsEntry", () => {
  test("sets the label and the Skills exactly as typed", () => {
    const updated = updateSkillsEntry(
      sampleResume,
      "skills-languages",
      { label: "Languages ", skills: "Go, Rust" },
      { now },
    );

    expect(skillsEntry(updated, "skills-languages")).toEqual({
      id: "skills-languages",
      enabled: true,
      label: "Languages ",
      skills: "Go, Rust",
    });
    expect(skillsEntry(updated, "skills-infra")).toEqual(skillsEntry(sampleResume, "skills-infra"));
    expect(updated.metadata.lastEditedAt).toBe("2026-09-26T12:00:00.000Z");
  });

  test("sets one field, leaving the other", () => {
    const updated = updateSkillsEntry(sampleResume, "skills-languages", { skills: "Go" }, { now });

    expect(skillsEntry(updated, "skills-languages")).toMatchObject({ label: "Languages", skills: "Go" });
  });

  test("an unknown Skills Entry changes nothing", () => {
    expect(updateSkillsEntry(sampleResume, "no-such-entry", { label: "x" }, { now })).toBe(sampleResume);
  });
});
