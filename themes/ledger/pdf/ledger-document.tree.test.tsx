import { describe, expect, test } from "vitest";
import { renderableView } from "@/lib/resume/renderable-view";
import { sampleResume } from "@/lib/resume/sample-resume";
import type { Resume } from "@/lib/resume/types";
import { placeSections } from "@/lib/theme/place-sections";
import { findByText, pathTo, primitiveTree, textOf, type Primitive } from "@/themes/testing/primitive-tree";
import { LEDGER_DEFAULT_LAYOUT } from "@/themes/ledger/default-layout";
import { LedgerDocument } from "./ledger-document";
import { colors } from "./styles";

// What reading the PDF back can't show: colours, sizes and what is kept together.

const PINE = colors.accent;
const MUTED = colors.inkMuted;

function ledgerTree(resume: Resume = sampleResume) {
  const zones = placeSections(renderableView(resume).sections, LEDGER_DEFAULT_LAYOUT);
  return primitiveTree(<LedgerDocument zones={zones} />);
}

/** The innermost part around `text` that a page never splits. */
function unbreakableAround(text: string): Primitive | undefined {
  return pathTo(ledgerTree(), text).findLast((node) => node.props.wrap === false);
}

describe("LedgerDocument's look", () => {
  test("draws the name large and bold", () => {
    const name = findByText(ledgerTree(), "Maya Okafor");

    expect(name.style).toMatchObject({ fontSize: 22.8, fontWeight: 600 });
  });

  test("draws Section titles as Pine green capitals over a rule", () => {
    const title = findByText(ledgerTree(), "Education");

    expect(title.style).toMatchObject({
      color: PINE,
      textTransform: "uppercase",
      fontWeight: 600,
      borderBottomWidth: 0.75,
    });
  });

  test("draws an Entry's dates smaller and muted", () => {
    const meta = findByText(ledgerTree(), "London, UK (hybrid) · Mar 2022 – Present");

    expect(meta.style).toMatchObject({ fontSize: 8.75, color: MUTED });
  });

  test("draws links in Pine green", () => {
    const link = findByText(ledgerTree(), "LinkedIn");

    expect(link.type).toBe("LINK");
    expect(link.props.src).toBe("https://www.linkedin.com/in/example-maya");
    expect(link.style).toMatchObject({ color: PINE });
  });

  test("marks top-level Bullets with a dot and nested ones with a ring, indented", () => {
    const tree = ledgerTree();
    const rowOf = (text: string) => pathTo(tree, text).findLast((node) => node.props.wrap === false);
    const dotOf = (row: Primitive | undefined) => (row?.children[0] as Primitive).children[0] as Primitive;

    const top = rowOf("Mentor to four engineers; two promoted to senior.");
    const nested = rowOf(
      "Designed the rollout: shadow traffic, then per-merchant flags, with zero failed payments during cutover.",
    );

    expect(top?.style.paddingLeft).toBe(0);
    expect(dotOf(top).style.backgroundColor).toBeDefined();
    expect(nested?.style.paddingLeft).toBe(14);
    expect(dotOf(nested).style.backgroundColor).toBeUndefined();
    expect(dotOf(nested).style.borderWidth).toBeGreaterThan(0);
  });

  test("keeps a Section's title, its first Entry's lines and first Bullet together", () => {
    const group = unbreakableAround("University of Manchester");

    expect(group && textOf(group)).toContain("Education");
    expect(group && textOf(group)).toContain("BSc Computer Science");
    expect(group && textOf(group)).toContain("Dissertation:");
  });

  test("keeps a later Entry's lines with its first Bullet, without the Section's title", () => {
    const group = unbreakableAround("Backend Engineer");

    expect(group && textOf(group)).toContain("Built the event ingestion pipeline");
    expect(group && textOf(group)).not.toContain("Professional Experience");
  });

  test("keeps a Skills Section's title with its first Entry", () => {
    const group = unbreakableAround("Languages");

    expect(group && textOf(group)).toContain("Skills");
    expect(group && textOf(group)).not.toContain("Infrastructure");
  });
});
