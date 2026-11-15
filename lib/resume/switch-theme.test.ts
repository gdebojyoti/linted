import { describe, expect, test } from "vitest";
import { sampleResume } from "./sample-resume";
import { switchTheme } from "./switch-theme";
import { setThemeOption } from "./theme-options";
import type { Resume } from "./types";

const now = new Date("2026-11-15T12:00:00.000Z");

/** The sample Resume with a Layout and a Theme Option of its own picked. */
function customised(): Resume {
  const withOption = setThemeOption(sampleResume, "accent", "cobalt", { now: new Date("2026-11-14T09:00:00.000Z") });
  return {
    ...withOption,
    themeSettings: { ...withOption.themeSettings, layout: { header: ["header-id"], main: ["experience-id"] } },
  };
}

describe("switchTheme", () => {
  test("sets the new Theme, resets the Layout and Theme Options to its defaults, and updates last-edited-at", () => {
    const switched = switchTheme(customised(), "margin", { now });

    expect(switched.themeSettings).toEqual({
      themeId: "margin",
      layout: null,
      options: { accent: null, typeface: null, density: null },
    });
    expect(switched.metadata.lastEditedAt).toBe("2026-11-15T12:00:00.000Z");
  });

  test("never changes the Content", () => {
    const resume = customised();

    expect(switchTheme(resume, "margin", { now }).content).toBe(resume.content);
  });

  test("picking the Theme the Resume already has isn't an edit, so its Layout and Theme Options stay", () => {
    const resume = customised();

    expect(switchTheme(resume, "ledger", { now })).toBe(resume);
  });
});
