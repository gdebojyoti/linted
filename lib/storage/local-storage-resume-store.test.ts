import { describe, expect, test } from "vitest";
import { newResume } from "@/lib/resume/new-resume";
import { SCHEMA_VERSION } from "@/lib/resume/types";
import { fakeStorage } from "./fake-storage";
import { localStorageResumeStore } from "./local-storage-resume-store";
import { resumeStoreContract } from "./resume-store-contract";

resumeStoreContract("localStorageResumeStore", () => localStorageResumeStore(fakeStorage()));

describe("localStorageResumeStore", () => {
  test("keeps each Resume as JSON under its own key, with its schema version", async () => {
    const storage = fakeStorage();
    const store = localStorageResumeStore(storage);
    const first = newResume();
    const second = newResume();

    await store.save(first);
    await store.save(second);

    expect(storage.length).toBe(2);
    const stored = JSON.parse(storage.getItem(`linted:resume:${first.metadata.id}`)!);
    expect(stored).toEqual(first);
    expect(stored.schemaVersion).toBe(SCHEMA_VERSION);
  });

  test("delete removes the Resume's key", async () => {
    const storage = fakeStorage();
    const store = localStorageResumeStore(storage);
    const resume = newResume();
    await store.save(resume);

    await store.delete(resume.metadata.id);

    expect(storage.getItem(`linted:resume:${resume.metadata.id}`)).toBeNull();
  });

  test("ignores keys that aren't Resumes", async () => {
    const storage = fakeStorage({ theme: "dark", "linted:other": "{}" });
    const store = localStorageResumeStore(storage);

    expect(await store.list()).toEqual([]);
  });

  describe.each([
    ["invalid JSON", "{not json"],
    ["an unknown schema version", JSON.stringify({ ...newResume(), schemaVersion: 99 })],
    ["no schema version", JSON.stringify({ metadata: { id: "bad" } })],
    ["a non-object", "42"],
  ])("an entry with %s", (_, value) => {
    const unreadable = () => fakeStorage({ "linted:resume:bad": value });

    test("is left out of the list", async () => {
      const store = localStorageResumeStore(unreadable());
      const good = newResume();
      await store.save(good);

      expect(await store.list()).toEqual([good]);
    });

    test("is not found", async () => {
      expect(await localStorageResumeStore(unreadable()).get("bad")).toBeNull();
    });

    test("is left in storage untouched", async () => {
      const storage = unreadable();
      const store = localStorageResumeStore(storage);

      await store.list();
      await store.get("bad");

      expect(storage.getItem("linted:resume:bad")).toBe(value);
    });
  });
});
