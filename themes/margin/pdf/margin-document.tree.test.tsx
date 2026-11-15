import { describe, expect, test } from "vitest";
import { layoutOf } from "@/lib/resume/layout";
import { renderableView } from "@/lib/resume/renderable-view";
import { sampleResume } from "@/lib/resume/sample-resume";
import { setThemeOption, themeOptionsOf } from "@/lib/resume/theme-options";
import type { Resume } from "@/lib/resume/types";
import { placeSections } from "@/lib/theme/place-sections";
import { MARGIN_LAYOUT } from "@/themes/margin/default-layout";
import { MARGIN_DEFAULT_OPTIONS } from "@/themes/margin/default-options";
import { findByText, pathTo, primitiveTree, textOf, type Primitive } from "@/themes/testing/primitive-tree";
import { MarginDocument } from "./margin-document";
import { colors } from "./styles";

// What reading the PDF back can't show: colours, sizes, widths and what is kept together.

/** The accents' colours, from the design (docs/design/linted-editor-tabs-design/tokens.css). */
const PINE = "#17784a";
const COBALT = "#2456c7";
const MUTED = colors.inkMuted;

function marginTree(resume: Resume = sampleResume) {
  const zones = placeSections(renderableView(resume).sections, layoutOf(resume, MARGIN_LAYOUT));
  return primitiveTree(<MarginDocument zones={zones} options={themeOptionsOf(resume, MARGIN_DEFAULT_OPTIONS)} />);
}

/** The innermost part around `text` that a page never splits. */
function unbreakableAround(text: string): Primitive | undefined {
  return pathTo(marginTree(), text).findLast((node) => node.props.wrap === false);
}

/** The column `text` is drawn in: the outermost View around it with a fixed width. */
function columnAround(text: string): Primitive | undefined {
  return pathTo(marginTree(), text).find((node) => node.type === "VIEW" && typeof node.style.width === "number");
}

describe("MarginDocument's look", () => {
  test("draws the name large and bold", () => {
    expect(findByText(marginTree(), "Maya Okafor").style).toMatchObject({ fontSize: 22.8, fontWeight: 600 });
  });

  test("draws Section titles as Pine green capitals over a rule", () => {
    expect(findByText(marginTree(), "Education").style).toMatchObject({
      color: PINE,
      textTransform: "uppercase",
      fontWeight: 600,
      borderBottomWidth: 0.75,
    });
  });

  test("draws links in Pine green", () => {
    const link = findByText(marginTree(), "LinkedIn");

    expect(link.type).toBe("LINK");
    expect(link.style).toMatchObject({ color: PINE });
  });

  test("draws Section titles and links in the accent picked", () => {
    const tree = marginTree(setThemeOption(sampleResume, "accent", "cobalt"));

    expect(findByText(tree, "Education").style).toMatchObject({ color: COBALT });
    expect(findByText(tree, "LinkedIn").style).toMatchObject({ color: COBALT });
  });

  test("draws an Entry's dates smaller and muted, on a line that wraps them below when they don't fit", () => {
    const tree = marginTree();
    const [line] = pathTo(tree, "London, UK (hybrid) · Mar 2022 – Present").filter(
      (node) => node.style.flexDirection === "row",
    ).slice(-1);

    expect(findByText(tree, "London, UK (hybrid) · Mar 2022 – Present").style).toMatchObject({
      fontSize: 8.75,
      color: MUTED,
    });
    expect(line.style).toMatchObject({ flexWrap: "wrap", justifyContent: "space-between" });
  });

  test("draws Education's place, years and results smaller and muted", () => {
    expect(findByText(marginTree(), "Manchester, UK · 2013 – 2017 · First-class honours").style).toMatchObject({
      fontSize: 8.75,
      color: MUTED,
    });
  });

  test("gives the sidebar 164pt and main the rest, pushed to the right so it stays there on later pages", () => {
    const sidebar = columnAround("Languages");
    const main = columnAround("Mentor to four engineers; two promoted to senior.");

    expect(sidebar?.style.width).toBe(164);
    expect(main?.style.width).toBeCloseTo(595.28 - 2 * 48 - 164 - 28, 2);
    expect(main?.style.marginLeft).toBe("auto");
  });

  test("keeps a Section's title, its first Entry's lines and first Bullet together", () => {
    const group = unbreakableAround("University of Manchester");

    expect(group && textOf(group)).toContain("Education");
    expect(group && textOf(group)).toContain("BSc Computer Science");
    expect(group && textOf(group)).toContain("Dissertation:");
  });

  test("keeps a Skills Section's title with its first Entry, the label above its list", () => {
    const group = unbreakableAround("Languages");
    const entry = pathTo(marginTree(), "Languages").at(-2);

    expect(group && textOf(group)).toContain("Skills");
    expect(group && textOf(group)).not.toContain("Infrastructure");
    expect(entry?.style.flexDirection).toBe("column");
  });

  test("keeps a later Entry's lines with its first Bullet, without the Section's title", () => {
    const group = unbreakableAround("Backend Engineer");

    expect(group && textOf(group)).toContain("Built the event ingestion pipeline");
    expect(group && textOf(group)).not.toContain("Professional Experience");
  });
});
