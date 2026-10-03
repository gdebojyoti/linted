import { describe, expect, test } from "vitest";
import { sampleResume } from "./sample-resume";
import type { ProjectEntry, Resume } from "./types";
import { updateProjectEntry } from "./update-project-entry";

const now = new Date("2026-10-04T12:00:00.000Z");

function projectEntry(resume: Resume, id: string): ProjectEntry {
  const projects = resume.content.sections.find((s) => s.type === "projects");
  const entry = projects?.entries.find((e) => e.id === id);
  if (!entry) throw new Error(`expected Project Entry ${id}`);
  return entry;
}

describe("updateProjectEntry", () => {
  test("sets the name, link label, link and tech stack exactly as typed", () => {
    const updated = updateProjectEntry(
      sampleResume,
      "proj-ledgerly",
      { name: "Ledgerly ", linkLabel: "Live demo", link: "https://demo.ledgerly.example.com", techStack: "Go, SQLite" },
      { now },
    );

    expect(projectEntry(updated, "proj-ledgerly")).toEqual({
      ...projectEntry(sampleResume, "proj-ledgerly"),
      name: "Ledgerly ",
      linkLabel: "Live demo",
      link: "https://demo.ledgerly.example.com",
      techStack: "Go, SQLite",
    });
    expect(projectEntry(updated, "proj-rate-limiter")).toEqual(projectEntry(sampleResume, "proj-rate-limiter"));
    expect(updated.metadata.lastEditedAt).toBe("2026-10-04T12:00:00.000Z");
  });

  test("sets one field, leaving the others, including dates and Bullets", () => {
    const before = projectEntry(sampleResume, "proj-ledgerly");
    const updated = updateProjectEntry(sampleResume, "proj-ledgerly", { techStack: "" }, { now });

    expect(projectEntry(updated, "proj-ledgerly")).toEqual({ ...before, techStack: "" });
  });

  describe("the link rule", () => {
    test.each(["https://github.com/maya", "http://maya.example.com", "mailto:maya@example.com", " HTTPS://x.io "])(
      "a link starting with http://, https:// or mailto: is saved as typed: %j",
      (link) => {
        const updated = updateProjectEntry(sampleResume, "proj-ledgerly", { link }, { now });

        expect(projectEntry(updated, "proj-ledgerly")).toMatchObject({ link });
      },
    );

    test.each(["ledgerly.example.com", "javascript:alert(1)", "ftp://files.example.com", "  "])(
      "any other link is saved as empty, keeping its label: %j",
      (link) => {
        const updated = updateProjectEntry(sampleResume, "proj-ledgerly", { link }, { now });

        expect(projectEntry(updated, "proj-ledgerly")).toMatchObject({ linkLabel: "ledgerly.example.com", link: "" });
      },
    );

    test("the rule is only for the link", () => {
      const updated = updateProjectEntry(sampleResume, "proj-ledgerly", { linkLabel: "ledgerly.example.com/x" }, { now });

      expect(projectEntry(updated, "proj-ledgerly")).toMatchObject({ linkLabel: "ledgerly.example.com/x" });
    });
  });

  test("an unknown Project Entry changes nothing", () => {
    expect(updateProjectEntry(sampleResume, "no-such-entry", { name: "x" }, { now })).toBe(sampleResume);
  });

  test("an Entry of another Section isn't changed", () => {
    expect(updateProjectEntry(sampleResume, "exp-paystream", { name: "x" }, { now })).toBe(sampleResume);
  });
});
