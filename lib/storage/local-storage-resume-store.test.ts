import { describe, expect, test } from "vitest";
import { newResume } from "@/lib/resume/new-resume";
import { sampleResume } from "@/lib/resume/sample-resume";
import type { Resume } from "@/lib/resume/types";
import { fakeStorage } from "./fake-storage";
import { localStorageResumeStore } from "./local-storage-resume-store";
import { resumeStoreContract } from "./resume-store-contract";

resumeStoreContract("localStorageResumeStore", () => localStorageResumeStore(fakeStorage()));

describe("localStorageResumeStore", () => {
  test("keeps each Resume as JSON under its own key", async () => {
    const storage = fakeStorage();
    const store = localStorageResumeStore(storage);
    const first = newResume();
    const second = newResume();

    await store.save(first);
    await store.save(second);

    expect(storage.length).toBe(2);
    const stored = JSON.parse(storage.getItem(`linted:resume:${first.metadata.id}`)!);
    expect(stored).toEqual(first);
  });

  test("delete removes the Resume's key", async () => {
    const storage = fakeStorage();
    const store = localStorageResumeStore(storage);
    const resume = newResume();
    await store.save(resume);

    await store.delete(resume.metadata.id);

    expect(storage.getItem(`linted:resume:${resume.metadata.id}`)).toBeNull();
  });

  test("doesn't reach for localStorage until it's used", async () => {
    // Node has no window, as on the server or when a browser blocks storage.
    const store = localStorageResumeStore();

    await expect(store.list()).rejects.toThrow();
  });

  test("a Resume saved before Theme Options existed reads with none picked", async () => {
    const resume = newResume();
    const oldThemeSettings: Partial<Resume["themeSettings"]> = { ...resume.themeSettings };
    delete oldThemeSettings.options;
    const storage = fakeStorage({
      [`linted:resume:${resume.metadata.id}`]: JSON.stringify({ ...resume, themeSettings: oldThemeSettings }),
    });
    const store = localStorageResumeStore(storage);

    expect((await store.get(resume.metadata.id))?.themeSettings.options).toEqual({
      accent: null,
      typeface: null,
      density: null,
    });
    expect(await store.list()).toEqual([resume]);
  });

  test("an Experience Entry saved before Positions existed reads as an Entry with one Position", async () => {
    const dates = { start: { year: 2022, month: 3, day: null }, current: true, end: null };
    const bullets = [{ id: "b1", enabled: false, text: "Led the **move**.", children: [] }];
    const oldEntry = { id: "job", enabled: false, company: "Paystream", role: "Engineer", location: "London", dates, bullets };
    const resume = sampleResume;
    const oldSections = resume.content.sections.map((section) =>
      section.type === "experience" ? { ...section, entries: [oldEntry] } : section,
    );
    const storage = fakeStorage({
      [`linted:resume:${resume.metadata.id}`]: JSON.stringify({ ...resume, content: { sections: oldSections } }),
    });
    const store = localStorageResumeStore(storage);

    const read = await store.get(resume.metadata.id);

    const experience = read?.content.sections.find((s) => s.type === "experience");
    expect(experience?.entries).toEqual([
      {
        id: "job",
        enabled: false,
        company: "Paystream",
        location: "London",
        positions: [{ id: "job-position-1", enabled: true, role: "Engineer", dates, bullets }],
      },
    ]);
    // Every other Section, and reading it again, are as they were.
    expect(read?.content.sections.filter((s) => s.type !== "experience")).toEqual(
      resume.content.sections.filter((s) => s.type !== "experience"),
    );
    expect(await store.list()).toEqual([read]);
  });

  test("a Resume already saved with Positions reads as it was saved", async () => {
    const storage = fakeStorage({ [`linted:resume:${sampleResume.metadata.id}`]: JSON.stringify(sampleResume) });

    expect(await localStorageResumeStore(storage).get(sampleResume.metadata.id)).toEqual(sampleResume);
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
    ["an id that doesn't match its key", JSON.stringify(newResume())],
  ])("a stored value with %s", (_, value) => {
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
