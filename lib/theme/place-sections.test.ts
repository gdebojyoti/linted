import { describe, expect, test } from "vitest";
import type { RenderedSection } from "@/lib/resume/renderable-view";
import { placeSections, type DefaultLayout } from "./place-sections";

const twoColumns: DefaultLayout = {
  header: "header",
  summary: "main",
  experience: "main",
  projects: "main",
  skills: "aside-left",
  education: "aside-left",
  custom: "main",
};

function section(id: string, type: RenderedSection["type"]): RenderedSection {
  if (type === "header") {
    return { id, type, title: "Header", pinned: true, name: "Maya", headline: "", entries: [] };
  }
  return { id, type, title: id, entries: [] } as RenderedSection;
}

const ids = (sections: RenderedSection[]) => sections.map((s) => s.id);

describe("placeSections", () => {
  test("puts each Section in the Zone its type is given by the default Layout, keeping Content order", () => {
    const zones = placeSections(
      [
        section("header", "header"),
        section("summary", "summary"),
        section("skills", "skills"),
        section("experience", "experience"),
        section("education", "education"),
      ],
      twoColumns,
    );

    expect(ids(zones.header)).toEqual(["header"]);
    expect(ids(zones.main)).toEqual(["summary", "experience"]);
    expect(ids(zones["aside-left"])).toEqual(["skills", "education"]);
  });

  test("a Pinned Section comes first in its Zone, wherever it sits in the Content", () => {
    const oneColumn: DefaultLayout = { ...twoColumns, header: "main", skills: "main", education: "main" };

    const zones = placeSections(
      [section("summary", "summary"), section("skills", "skills"), section("header", "header")],
      oneColumn,
    );

    expect(ids(zones.main)).toEqual(["header", "summary", "skills"]);
  });

  test("Custom Sections are placed by the Custom type, in Content order", () => {
    const zones = placeSections(
      [section("talks", "custom"), section("summary", "summary"), section("volunteering", "custom")],
      { ...twoColumns, custom: "footer" },
    );

    expect(ids(zones.footer)).toEqual(["talks", "volunteering"]);
    expect(ids(zones.main)).toEqual(["summary"]);
  });

  test("Zones with no Sections are empty", () => {
    const zones = placeSections([section("summary", "summary")], twoColumns);

    expect(zones.header).toEqual([]);
    expect(zones["aside-right"]).toEqual([]);
  });
});
