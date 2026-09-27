import { SCHEMA_VERSION, type Resume } from "@/lib/resume/types";
import type { ResumeStore } from "./resume-store";

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

  function keys() {
    const found: string[] = [];
    for (let i = 0; i < storage().length; i++) {
      const key = storage().key(i);
      if (key?.startsWith(KEY_PREFIX)) found.push(key);
    }
    return found;
  }

  // An entry that isn't valid JSON, has an unknown schema version or holds a
  // different Resume's id than its key is treated as missing but left in
  // place, so a later migration or a manual fix can recover it.
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
    return readable ? (value as Resume) : null;
  }

  return {
    async save(resume) {
      storage().setItem(KEY_PREFIX + resume.metadata.id, JSON.stringify(resume));
    },
    async get(id) {
      return read(KEY_PREFIX + id);
    },
    async list() {
      return keys().flatMap((key) => read(key) ?? []);
    },
    async delete(id) {
      storage().removeItem(KEY_PREFIX + id);
    },
  };
}
