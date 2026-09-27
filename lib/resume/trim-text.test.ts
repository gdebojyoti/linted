import { describe, expect, test } from "vitest";
import { sampleResume } from "./sample-resume";
import { trimText } from "./trim-text";
import { updateContact } from "./update-contact";
import { updateHeader } from "./update-header";
import { updateSkillsEntry } from "./update-skills-entry";

const now = new Date("2026-09-27T12:00:00.000Z");

describe("trimText", () => {
  test("trims text fields at every depth of the Content", () => {
    let resume = updateHeader(sampleResume, { name: "  Maya O. ", headline: "Staff Engineer\n" }, { now });
    resume = updateContact(resume, "contact-phone", { value: " +44 7700 900999 " }, { now });
    resume = updateSkillsEntry(resume, "skills-languages", { skills: "Go, SQL  " }, { now });

    expect(trimText(resume)).toEqual(
      updateSkillsEntry(
        updateContact(
          updateHeader(sampleResume, { name: "Maya O.", headline: "Staff Engineer" }, { now }),
          "contact-phone",
          { value: "+44 7700 900999" },
          { now },
        ),
        "skills-languages",
        { skills: "Go, SQL" },
        { now },
      ),
    );
  });

  test("leaves already-trimmed Content equal", () => {
    expect(trimText(sampleResume)).toEqual(sampleResume);
  });

  test("does not change the given Resume", () => {
    const resume = updateHeader(sampleResume, { name: " Maya " }, { now });
    const before = structuredClone(resume);

    trimText(resume);

    expect(resume).toEqual(before);
  });
});
