import { describe, expect, test } from "vitest";
import { sampleResume } from "./sample-resume";
import { setThemeOption, themeOptionsOf } from "./theme-options";
import type { Resume } from "./types";

const now = new Date("2026-11-12T12:00:00.000Z");

describe("setThemeOption", () => {
  test("picks a Theme Option, keeps the others and the Layout, and updates last-edited-at", () => {
    const edited = setThemeOption(sampleResume, "accent", "cobalt", { now });

    expect(edited.themeSettings).toEqual({
      ...sampleResume.themeSettings,
      options: { accent: "cobalt", typeface: null, density: null },
    });
    expect(edited.metadata.lastEditedAt).toBe("2026-11-12T12:00:00.000Z");
    expect(edited.content).toBe(sampleResume.content);
  });

  test("picking the option already picked isn't an edit", () => {
    const compact = setThemeOption(sampleResume, "density", "compact", { now });

    expect(setThemeOption(compact, "density", "compact", { now })).toBe(compact);
  });
});

describe("themeOptionsOf", () => {
  const ledgerDefaults = { accent: "pine", typeface: "serif", density: "comfortable" } as const;

  test("gives each option picked, and the Theme's default for each one not picked", () => {
    const resume = setThemeOption(sampleResume, "typeface", "classic", { now });

    expect(themeOptionsOf(resume, ledgerDefaults)).toEqual({ accent: "pine", typeface: "classic", density: "comfortable" });
  });

  test("a name it doesn't know, from hand-edited or future data, means the default", () => {
    const resume = {
      ...sampleResume,
      themeSettings: {
        ...sampleResume.themeSettings,
        options: { accent: "neon", typeface: "comic", density: "cosy" },
      },
    } as unknown as Resume;

    expect(themeOptionsOf(resume, ledgerDefaults)).toEqual(ledgerDefaults);
  });
});
