import { describe, expect, test } from "vitest";
import { memoryResumeStore } from "@/lib/storage/memory-resume-store";
import { resumes } from "./resumes";

const now = new Date("2026-09-27T10:00:00.000Z");

describe("resumes", () => {
  test("create saves a new Resume and returns it", async () => {
    const library = resumes(memoryResumeStore(), { now: () => now });

    const created = await library.create();

    expect(created.metadata.createdAt).toBe(now.toISOString());
    expect(await library.get(created.metadata.id)).toEqual(created);
  });

  test("get returns null for an unknown id", async () => {
    expect(await resumes(memoryResumeStore()).get("missing")).toBeNull();
  });

  test("list is empty when there are no Resumes", async () => {
    expect(await resumes(memoryResumeStore()).list()).toEqual([]);
  });

  test("list puts the most recently edited Resume first", async () => {
    const store = memoryResumeStore();
    let clock = new Date("2026-09-27T10:00:00.000Z");
    const library = resumes(store, { now: () => clock });

    const older = await library.create();
    clock = new Date("2026-09-27T11:00:00.000Z");
    const newer = await library.create();
    clock = new Date("2026-09-27T09:00:00.000Z");
    const oldest = await library.create();

    // Editing the first Resume later moves it to the top.
    const edited = {
      ...older,
      metadata: { ...older.metadata, lastEditedAt: "2026-09-27T12:00:00.000Z" },
    };
    await store.save(edited);

    expect(await library.list()).toEqual([edited, newer, oldest]);
  });
});
