import { describe, expect, test } from "vitest";
import { sampleResume } from "./sample-resume";
import type { HeaderSection, Resume } from "./types";
import { updateHeader, type HeaderChanges } from "./update-header";

const now = new Date("2026-09-26T12:00:00.000Z");

function headerOf(resume: Resume): HeaderSection {
  const header = resume.content.sections.find((s) => s.type === "header");
  if (!header) throw new Error("expected a Header");
  return header;
}

function otherSections(resume: Resume) {
  return resume.content.sections.filter((s) => s.type !== "header");
}

describe("updateHeader", () => {
  test("sets the name, leaving every other Section as it was", () => {
    const updated = updateHeader(sampleResume, { name: "Maya O." }, { now });

    expect(headerOf(updated).name).toBe("Maya O.");
    expect(headerOf(updated).headline).toBe("Senior Backend Engineer");
    expect(otherSections(updated)).toEqual(otherSections(sampleResume));
  });

  test("the Header can't be renamed, even when a title is passed in", () => {
    const changes = { name: "Maya O.", title: "Contact" } as HeaderChanges;

    expect(headerOf(updateHeader(sampleResume, changes, { now })).title).toBe("Header");
  });

  test("sets the headline, keeping the text exactly as typed", () => {
    const updated = updateHeader(sampleResume, { headline: "Staff Engineer " }, { now });

    expect(headerOf(updated).headline).toBe("Staff Engineer ");
    expect(headerOf(updated).name).toBe("Maya Okafor");
  });

  test("updates last-edited-at, and nothing else in the Metadata", () => {
    const updated = updateHeader(sampleResume, { name: "Maya O." }, { now });

    expect(updated.metadata).toEqual({ ...sampleResume.metadata, lastEditedAt: "2026-09-26T12:00:00.000Z" });
  });

  test("returns a new Resume and leaves the one it was given unchanged", () => {
    const before = structuredClone(sampleResume);

    updateHeader(sampleResume, { name: "Maya O.", headline: "Staff Engineer" }, { now });

    expect(sampleResume).toEqual(before);
  });
});
