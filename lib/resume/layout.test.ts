import { describe, expect, test } from "vitest";
import { layoutOf, layoutTag, moveSection, moveSectionToZone, resetLayout, type ThemeLayout } from "./layout";
import { newResume } from "./new-resume";
import { sampleResume } from "./sample-resume";
import { addCustomSection, deleteSection, setSectionEnabled } from "./sections";
import type { Layout, Resume } from "./types";

const now = new Date("2026-11-11T12:00:00.000Z");

/** A two-column Theme: the Header on top, Skills and Education in a sidebar, the rest in main. */
const twoColumn: ThemeLayout = {
  zones: ["header", "aside-left", "main"],
  defaultLayout: {
    header: "header",
    summary: "main",
    experience: "main",
    projects: "main",
    skills: "aside-left",
    education: "aside-left",
    custom: "main",
  },
};

const DEFAULT_LAYOUT: Layout = {
  header: ["header"],
  "aside-left": ["skills", "education"],
  main: ["summary", "experience", "projects", "custom-talks", "custom-volunteering"],
};

function withLayout(layout: Layout | null, resume: Resume = sampleResume): Resume {
  return { ...resume, themeSettings: { ...resume.themeSettings, layout } };
}

describe("layoutOf", () => {
  test("with no saved Layout, places every Section by the Theme's default, in Content order", () => {
    expect(layoutOf(sampleResume, twoColumn)).toEqual(DEFAULT_LAYOUT);
  });

  test("follows the saved Layout", () => {
    const saved: Layout = {
      header: ["header", "summary"],
      "aside-left": ["education"],
      main: ["custom-volunteering", "experience", "skills", "projects", "custom-talks"],
    };

    expect(layoutOf(withLayout(saved), twoColumn)).toEqual(saved);
  });

  test("a newly added Custom Section goes at the end of the Zone the Theme puts Custom Sections in", () => {
    const saved: Layout = {
      header: ["header"],
      "aside-left": ["skills", "education"],
      main: ["custom-talks", "projects", "experience", "summary"],
    };
    const resume = addCustomSection(withLayout(saved), { newId: () => "new-custom", now });

    expect(layoutOf(resume, twoColumn)).toEqual({
      ...saved,
      main: ["custom-talks", "projects", "experience", "summary", "custom-volunteering", "new-custom"],
    });
  });

  test("ignores ids of Sections that no longer exist, and Zones the Theme doesn't draw", () => {
    const saved: Layout = {
      header: ["header", "gone"],
      "aside-left": ["skills", "education"],
      main: ["summary", "experience", "projects", "custom-talks"],
      footer: ["custom-volunteering"],
    };

    expect(layoutOf(withLayout(saved), twoColumn)).toEqual({
      header: ["header"],
      "aside-left": ["skills", "education"],
      main: ["summary", "experience", "projects", "custom-talks", "custom-volunteering"],
    });
  });

  test("a Section saved twice keeps only its first place", () => {
    const saved: Layout = { ...DEFAULT_LAYOUT, main: ["summary", "summary", ...DEFAULT_LAYOUT.main!.slice(1)] };

    expect(layoutOf(withLayout(saved), twoColumn)).toEqual(DEFAULT_LAYOUT);
  });

  test("the Pinned Header is always first in its Zone, even if saved below another Section", () => {
    const saved: Layout = { ...DEFAULT_LAYOUT, header: ["summary", "header"], main: DEFAULT_LAYOUT.main!.slice(1) };

    expect(layoutOf(withLayout(saved), twoColumn).header).toEqual(["header", "summary"]);
  });

  test("the Pinned Header is first wherever it sits in the Content", () => {
    const [header, ...rest] = sampleResume.content.sections;
    const allInMain: ThemeLayout = { zones: ["main"], defaultLayout: { ...twoColumn.defaultLayout, header: "main", skills: "main", education: "main" } };

    expect(layoutOf({ ...sampleResume, content: { sections: [...rest, header] } }, allInMain).main?.[0]).toBe("header");
  });
});

describe("moveSection", () => {
  test("up swaps a Section with the one above it, and saves the whole Layout", () => {
    const moved = moveSection(sampleResume, twoColumn, "experience", "up", { now });

    expect(moved.themeSettings.layout).toEqual({
      ...DEFAULT_LAYOUT,
      main: ["experience", "summary", "projects", "custom-talks", "custom-volunteering"],
    });
    expect(moved.metadata.lastEditedAt).toBe("2026-11-11T12:00:00.000Z");
    expect(sampleResume.themeSettings.layout).toBeNull();
  });

  test("down swaps a Section with the one below it", () => {
    const moved = moveSection(sampleResume, twoColumn, "skills", "down", { now });

    expect(layoutOf(moved, twoColumn)["aside-left"]).toEqual(["education", "skills"]);
  });

  test("moves never leave the Section's Zone: up from the top or down from the bottom changes nothing", () => {
    expect(moveSection(sampleResume, twoColumn, "summary", "up", { now })).toBe(sampleResume);
    expect(moveSection(sampleResume, twoColumn, "custom-volunteering", "down", { now })).toBe(sampleResume);
    expect(moveSection(sampleResume, twoColumn, "skills", "up", { now })).toBe(sampleResume);
  });

  test("nothing moves above the Pinned Header, and the Header itself never moves", () => {
    const sharesHeaderZone = withLayout({ ...DEFAULT_LAYOUT, header: ["header", "summary"], main: DEFAULT_LAYOUT.main!.slice(1) });

    expect(moveSection(sharesHeaderZone, twoColumn, "summary", "up", { now })).toBe(sharesHeaderZone);
    expect(moveSection(sharesHeaderZone, twoColumn, "header", "down", { now })).toBe(sharesHeaderZone);
  });

  test("an unknown Section id changes nothing", () => {
    expect(moveSection(sampleResume, twoColumn, "no-such-section", "up", { now })).toBe(sampleResume);
  });
});

describe("moveSectionToZone", () => {
  test("moves a Section to the end of another of the Theme's Zones", () => {
    const moved = moveSectionToZone(sampleResume, twoColumn, "experience", "aside-left", { now });

    expect(moved.themeSettings.layout).toEqual({
      header: ["header"],
      "aside-left": ["skills", "education", "experience"],
      main: ["summary", "projects", "custom-talks", "custom-volunteering"],
    });
    expect(moved.metadata.lastEditedAt).toBe("2026-11-11T12:00:00.000Z");
  });

  test("a Section moved into the Header's Zone goes below the Pinned Header", () => {
    const moved = moveSectionToZone(sampleResume, twoColumn, "summary", "header", { now });

    expect(layoutOf(moved, twoColumn).header).toEqual(["header", "summary"]);
  });

  test("changes nothing for the Section's own Zone, a Zone the Theme doesn't draw, the Pinned Header or an unknown id", () => {
    expect(moveSectionToZone(sampleResume, twoColumn, "summary", "main", { now })).toBe(sampleResume);
    expect(moveSectionToZone(sampleResume, twoColumn, "summary", "footer", { now })).toBe(sampleResume);
    expect(moveSectionToZone(sampleResume, twoColumn, "header", "main", { now })).toBe(sampleResume);
    expect(moveSectionToZone(sampleResume, twoColumn, "no-such-section", "main", { now })).toBe(sampleResume);
  });
});

describe("resetLayout", () => {
  test("restores the Theme's default Layout", () => {
    const moved = moveSection(sampleResume, twoColumn, "experience", "up", { now });
    const reset = resetLayout(moved, { now: new Date("2026-11-12T08:00:00.000Z") });

    expect(reset.themeSettings.layout).toBeNull();
    expect(layoutOf(reset, twoColumn)).toEqual(DEFAULT_LAYOUT);
    expect(reset.metadata.lastEditedAt).toBe("2026-11-12T08:00:00.000Z");
  });

  test("changes nothing when no Layout is saved", () => {
    expect(resetLayout(sampleResume, { now })).toBe(sampleResume);
  });
});

describe("deleting a Custom Section", () => {
  test("removes it from the saved Layout too", () => {
    const moved = moveSection(sampleResume, twoColumn, "custom-talks", "up", { now });
    const deleted = deleteSection(moved, "custom-talks", { now });

    expect(deleted.themeSettings.layout).toEqual({
      ...DEFAULT_LAYOUT,
      main: ["summary", "experience", "projects", "custom-volunteering"],
    });
  });

  test("leaves an unset Layout unset", () => {
    expect(deleteSection(sampleResume, "custom-talks", { now }).themeSettings.layout).toBeNull();
  });
});

describe("layoutTag", () => {
  function tagOf(resume: Resume, id: string) {
    const section = resume.content.sections.find((s) => s.id === id);
    if (!section) throw new Error(`expected Section ${id}`);
    return layoutTag(section);
  }

  test("a Section the preview shows has no tag", () => {
    expect(tagOf(sampleResume, "experience")).toBeNull();
  });

  test("a Disabled Section is tagged Disabled", () => {
    expect(tagOf(sampleResume, "custom-volunteering")).toBe("Disabled");
  });

  test("an Enabled Section with nothing to show is tagged Empty", () => {
    const resume = newResume({ newId: (() => { let n = 0; return () => `id-${n++}`; })(), now });

    expect(resume.content.sections.map(layoutTag)).toEqual(["Empty", "Empty", "Empty", "Empty", "Empty", "Empty"]);
  });

  test("a Section that is both Disabled and Empty is tagged Disabled", () => {
    const resume = addCustomSection(sampleResume, { newId: () => "new-custom", now });

    expect(tagOf(resume, "new-custom")).toBe("Empty");
    expect(tagOf(setSectionEnabled(resume, "new-custom", false, { now }), "new-custom")).toBe("Disabled");
  });
});
