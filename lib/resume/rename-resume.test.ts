import { describe, expect, test } from "vitest";
import { memoryResumeStore } from "@/lib/storage/memory-resume-store";
import { renameResume } from "./rename-resume";
import { resumeLibrary } from "./resume-library";
import { sampleResume } from "./sample-resume";

const now = new Date("2026-09-28T12:00:00.000Z");

describe("renameResume", () => {
  test("sets the Resume Title, trimmed, and updates last-edited-at", () => {
    const renamed = renameResume(sampleResume, "  Stripe backend v3 ", { now });

    expect(renamed.metadata).toEqual({
      ...sampleResume.metadata,
      title: "Stripe backend v3",
      lastEditedAt: "2026-09-28T12:00:00.000Z",
    });
    expect(renamed.content).toBe(sampleResume.content);
  });

  test("rejects an empty or whitespace-only title", () => {
    expect(renameResume(sampleResume, "", { now })).toBe(sampleResume);
    expect(renameResume(sampleResume, "  \t ", { now })).toBe(sampleResume);
  });

  test("renaming to the same title isn't an edit", () => {
    expect(renameResume(sampleResume, ` ${sampleResume.metadata.title} `, { now })).toBe(sampleResume);
  });

  test("two Resumes may share a title", async () => {
    const library = resumeLibrary(memoryResumeStore());
    const first = await library.create("Backend");
    const second = await library.create("Frontend");

    await library.save(renameResume(second, "Backend", { now }));

    expect((await library.list()).map((r) => r.metadata.title)).toEqual(["Backend", "Backend"]);
    expect(await library.get(first.metadata.id)).toEqual(first);
  });

  test("does not change the given Resume", () => {
    const before = structuredClone(sampleResume);

    renameResume(sampleResume, "Other", { now });

    expect(sampleResume).toEqual(before);
  });
});
