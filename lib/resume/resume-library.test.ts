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

  test("duplicate saves a copy with the given title and leaves the original as it was", async () => {
    const library = resumeLibrary(memoryResumeStore(), { clock: () => at("11:00") });
    const original = await library.create("Stripe backend v2");

    const copy = await library.duplicate(original, "Stripe backend v3");

    expect(copy.metadata.id).not.toBe(original.metadata.id);
    expect(await library.get(copy.metadata.id)).toEqual(copy);
    expect(copy.metadata.title).toBe("Stripe backend v3");
    expect(await library.get(original.metadata.id)).toEqual(original);
    expect(await library.list()).toHaveLength(2);
  });

  test("duplicate copies edits that aren't saved yet, with their text trimmed", async () => {
    const library = resumeLibrary(memoryResumeStore());
    const original = await library.create();
    const unsaved = updateHeader(original, { name: " Maya O. " });

    const copy = await library.duplicate(unsaved);

    const header = (await library.get(copy.metadata.id))?.content.sections.find((s) => s.type === "header");
    expect(header && "name" in header && header.name).toBe("Maya O.");
    expect(copy.metadata.title).toBe("Untitled Resume (copy)");
  });

  test("save stores the Resume with its text trimmed", async () => {
    const library = resumeLibrary(memoryResumeStore());
    const created = await library.create();
    const now = at("11:00");

    await library.save(updateHeader(created, { name: " Maya O. " }, { now }));

    expect(await library.get(created.metadata.id)).toEqual(updateHeader(created, { name: "Maya O." }, { now }));
  });

  test("delete removes only that Resume", async () => {
    const library = resumeLibrary(memoryResumeStore());
    const kept = await library.create("Kept");
    const deleted = await library.create("Deleted");

    await library.delete(deleted.metadata.id);

    expect(await library.get(deleted.metadata.id)).toBeNull();
    expect(await library.list()).toEqual([kept]);
  });

  test("deleting an unknown id changes nothing", async () => {
    const library = resumeLibrary(memoryResumeStore());
    const kept = await library.create();

    await library.delete("missing");

    expect(await library.list()).toEqual([kept]);
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
