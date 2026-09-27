import { describe, expect, test } from "vitest";
import { newResume } from "@/lib/resume/new-resume";
import { DEFAULT_RESUME_TITLE } from "@/lib/resume/types";
import type { ResumeStore } from "./resume-store";

/**
 * The behaviour every ResumeStore must have. Each implementation's test file
 * runs this suite against a fresh, empty store.
 */
export function resumeStoreContract(name: string, emptyStore: () => ResumeStore) {
  describe(`${name} (ResumeStore contract)`, () => {
    test("an empty store lists no Resumes", async () => {
      expect(await emptyStore().list()).toEqual([]);
    });

    test("an empty store finds no Resume", async () => {
      expect(await emptyStore().get("missing")).toBeNull();
    });

    test("a saved Resume can be got by its id and is listed", async () => {
      const store = emptyStore();
      const resume = newResume();

      await store.save(resume);

      expect(await store.get(resume.metadata.id)).toEqual(resume);
      expect(await store.list()).toEqual([resume]);
    });

    test("saving a Resume with a stored id replaces it", async () => {
      const store = emptyStore();
      const original = newResume();
      const renamed = { ...original, metadata: { ...original.metadata, title: "Renamed" } };

      await store.save(original);
      await store.save(renamed);

      expect(await store.get(original.metadata.id)).toEqual(renamed);
      expect(await store.list()).toEqual([renamed]);
    });

    test("delete removes only that Resume", async () => {
      const store = emptyStore();
      const keep = newResume();
      const gone = newResume();
      await store.save(keep);
      await store.save(gone);

      await store.delete(gone.metadata.id);

      expect(await store.get(gone.metadata.id)).toBeNull();
      expect(await store.list()).toEqual([keep]);
    });

    test("deleting an unknown id changes nothing", async () => {
      const store = emptyStore();
      const resume = newResume();
      await store.save(resume);

      await store.delete("missing");

      expect(await store.list()).toEqual([resume]);
    });

    test("changing a Resume after saving it doesn't change the stored one", async () => {
      const store = emptyStore();
      const resume = newResume();
      await store.save(resume);

      resume.metadata.title = "Changed after saving";

      expect((await store.get(resume.metadata.id))?.metadata.title).toBe(DEFAULT_RESUME_TITLE);
    });

    test("changing a Resume that was got doesn't change the stored one", async () => {
      const store = emptyStore();
      const resume = newResume();
      await store.save(resume);

      const got = await store.get(resume.metadata.id);
      got!.metadata.title = "Changed after getting";
      const [listed] = await store.list();
      listed.metadata.title = "Changed after listing";

      expect((await store.get(resume.metadata.id))?.metadata.title).toBe(DEFAULT_RESUME_TITLE);
    });
  });
}
