import { describe, expect, test } from "vitest";
import type { RenderedSection } from "@/lib/resume/renderable-view";
import { placeSections } from "./place-sections";

function section(id: string, type: RenderedSection["type"]): RenderedSection {
  if (type === "header") {
    return { id, type, title: "Header", pinned: true, name: "Maya", headline: "", entries: [] };
  }
  return { id, type, title: id, entries: [] } as RenderedSection;
}

const ids = (sections: RenderedSection[]) => sections.map((s) => s.id);

describe("placeSections", () => {
  test("puts each Section in its Zone of the Layout, in the Layout's order", () => {
    const zones = placeSections(
      [
        section("header", "header"),
        section("summary", "summary"),
        section("skills", "skills"),
        section("experience", "experience"),
        section("education", "education"),
      ],
      { header: ["header"], "aside-left": ["education", "skills"], main: ["experience", "summary"] },
    );

    expect(ids(zones.header)).toEqual(["header"]);
    expect(ids(zones.main)).toEqual(["experience", "summary"]);
    expect(ids(zones["aside-left"])).toEqual(["education", "skills"]);
  });

  test("leaves out Layout ids with no Section to draw, such as Empty or Disabled ones", () => {
    const zones = placeSections([section("summary", "summary")], { main: ["experience", "summary", "talks"] });

    expect(ids(zones.main)).toEqual(["summary"]);
  });

  test("Zones with no Sections are empty", () => {
    const zones = placeSections([section("summary", "summary")], { main: ["summary"] });

    expect(zones.header).toEqual([]);
    expect(zones["aside-right"]).toEqual([]);
  });
});
