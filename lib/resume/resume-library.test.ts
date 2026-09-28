import { describe, expect, test } from "vitest";
import { memoryResumeStore } from "@/lib/storage/memory-resume-store";
import { newResume } from "./new-resume";
import { resumeLibrary } from "./resume-library";
import type { Resume } from "./types";
import { updateHeader } from "./update-header";

const at = (time: string) => new Date(`2026-09-27T${time}:00.000Z`);

/** A Resume saved straight to the store with the given times, as if edited earlier. */
function stored(id: string, createdAt: string, lastEditedAt: string): Resume {
  const resume = newResume();
  return {
    ...resume,
    metadata: {
      ...resume.metadata,
      id,
      createdAt: at(createdAt).toISOString(),
      lastEditedAt: at(lastEditedAt).toISOString(),
    },
  };
}

describe("resumeLibrary", () => {
  test("create saves a new Resume and returns it", async () => {
    const library = resumeLibrary(memoryResumeStore(), { clock: () => at("10:00") });

    const created = await library.create();

    expect(created.metadata.createdAt).toBe(at("10:00").toISOString());
    expect(await library.get(created.metadata.id)).toEqual(created);
  });

  test("create saves the Resume with the given title", async () => {
    const library = resumeLibrary(memoryResumeStore());

    const created = await library.create("Stripe backend v2");

    expect((await library.get(created.metadata.id))?.metadata.title).toBe("Stripe backend v2");
  });

  test("save stores the Resume with its text trimmed", async () => {
    const library = resumeLibrary(memoryResumeStore());
    const created = await library.create();
    const now = at("11:00");

    await library.save(updateHeader(created, { name: " Maya O. " }, { now }));

    expect(await library.get(created.metadata.id)).toEqual(updateHeader(created, { name: "Maya O." }, { now }));
  });

  test("get returns null for an unknown id", async () => {
    expect(await resumeLibrary(memoryResumeStore()).get("missing")).toBeNull();
  });

  test("list is empty when there are no Resumes", async () => {
    expect(await resumeLibrary(memoryResumeStore()).list()).toEqual([]);
  });

  test("list puts the most recently edited Resume first", async () => {
    const store = memoryResumeStore();
    // Saved in an order that differs from the expected one.
    const middle = stored("middle", "08:00", "10:00");
    const oldest = stored("oldest", "08:00", "09:00");
    const newest = stored("newest", "08:00", "12:00");
    for (const resume of [middle, oldest, newest]) await store.save(resume);

    expect(await resumeLibrary(store).list()).toEqual([newest, middle, oldest]);
  });

  test("list breaks ties by the most recently created, then by id", async () => {
    const store = memoryResumeStore();
    const createdEarlier = stored("c", "09:00", "12:00");
    const b = stored("b", "10:00", "12:00");
    const a = stored("a", "10:00", "12:00");
    for (const resume of [createdEarlier, b, a]) await store.save(resume);

    expect(await resumeLibrary(store).list()).toEqual([a, b, createdEarlier]);
  });
});
