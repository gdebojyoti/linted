import {
  NO_THEME_OPTIONS_PICKED,
  SCHEMA_VERSION,
  type Bullet,
  type DateRange,
  type ExperienceEntry,
  type Resume,
} from "@/lib/resume/types";
import type { ResumeStore } from "./resume-store";

/** An Experience Entry as saved before Positions existed. */
type EntryWithoutPositions = {
  id: string;
  enabled: boolean;
  company: string;
  role: string;
  location: string;
  dates: DateRange;
  bullets: Bullet[];
};

function isWithoutPositions(entry: ExperienceEntry | EntryWithoutPositions): entry is EntryWithoutPositions {
  return !Array.isArray((entry as Partial<ExperienceEntry>).positions);
}

function toPositions({ id, enabled, company, role, location, dates, bullets }: EntryWithoutPositions): ExperienceEntry {
  return { id, enabled, company, location, positions: [{ id: `${id}-position-1`, enabled: true, role, dates, bullets }] };
}

/** The parts of the browser's Storage this store uses. */
type StringStorage = Pick<Storage, "length" | "key" | "getItem" | "setItem" | "removeItem">;

const KEY_PREFIX = "linted:resume:";

/**
 * Keeps each Resume as JSON under its own localStorage key. The only code
 * that touches localStorage (ADR 0002). localStorage is looked up only when
 * a method runs, so creating the store is safe anywhere, and a missing or
 * blocked localStorage makes that call's promise fail.
 */
export function localStorageResumeStore(injected?: StringStorage): ResumeStore {
  function storage() {
    return injected ?? window.localStorage;
  }

  function resumeKeys() {
    const found: string[] = [];
    for (let i = 0; i < storage().length; i++) {
      const key = storage().key(i);
      if (key?.startsWith(KEY_PREFIX)) found.push(key);
    }
    return found;
  }

  /**
   * A stored value that isn't valid JSON, has an unknown schema version or
   * holds a different Resume's id than its key is treated as missing but left
   * in place, so a later migration or a manual fix can recover it.
   */
  function read(key: string): Resume | null {
    const json = storage().getItem(key);
    if (json === null) return null;

    let value: unknown;
    try {
      value = JSON.parse(json);
    } catch {
      return null;
    }

    const readable =
      typeof value === "object" &&
      value !== null &&
      "schemaVersion" in value &&
      value.schemaVersion === SCHEMA_VERSION &&
      (value as Resume).metadata?.id === key.slice(KEY_PREFIX.length);
    return readable ? withPositions(withThemeOptions(value as Resume)) : null;
  }

  /**
   * An Experience Entry saved before Positions existed holds one role, with
   * its dates and Bullets, on the Entry itself. It becomes an Entry with one
   * Position holding them, so nothing is lost. The Position's id comes from
   * the Entry's, so reading the same Resume twice gives the same ids. It's
   * saved in the new shape with the next edit. SCHEMA_VERSION stays 1 while
   * there are no other users.
   */
  function withPositions(resume: Resume): Resume {
    const sections = resume.content?.sections;
    if (!Array.isArray(sections)) return resume;
    if (!sections.some((s) => s.type === "experience" && s.entries.some(isWithoutPositions))) return resume;
    return {
      ...resume,
      content: {
        ...resume.content,
        sections: sections.map((section) =>
          section.type === "experience"
            ? { ...section, entries: section.entries.map((entry) => (isWithoutPositions(entry) ? toPositions(entry) : entry)) }
            : section,
        ),
      },
    };
  }

  /**
   * A Resume saved before Theme Options existed (#89) has none, so it gets
   * none picked; so does one whose options aren't an object at all.
   * SCHEMA_VERSION stays 1 while there are no other users. A Resume with no
   * Theme Settings is left as it is, as before.
   */
  function withThemeOptions(resume: Resume): Resume {
    const settings = resume.themeSettings as Resume["themeSettings"] | undefined;
    if (!settings || (typeof settings.options === "object" && settings.options !== null)) return resume;
    return { ...resume, themeSettings: { ...settings, options: { ...NO_THEME_OPTIONS_PICKED } } };
  }

  return {
    async save(resume) {
      storage().setItem(KEY_PREFIX + resume.metadata.id, JSON.stringify(resume));
    },
    async get(id) {
      return read(KEY_PREFIX + id);
    },
    async list() {
      return resumeKeys().flatMap((key) => read(key) ?? []);
    },
    async delete(id) {
      storage().removeItem(KEY_PREFIX + id);
    },
  };
}
