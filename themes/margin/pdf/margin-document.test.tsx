import { describe, expect, test } from "vitest";
import { layoutOf } from "@/lib/resume/layout";
import { renderableView } from "@/lib/resume/renderable-view";
import { sampleResume } from "@/lib/resume/sample-resume";
import { setThemeOption, themeOptionsOf } from "@/lib/resume/theme-options";
import type { CustomSection, ExperienceEntry, Layout, Resume, Section, SkillsSection } from "@/lib/resume/types";
import { placeSections } from "@/lib/theme/place-sections";
import { MARGIN_LAYOUT } from "@/themes/margin/default-layout";
import { MARGIN_DEFAULT_OPTIONS } from "@/themes/margin/default-options";
import { pageText, readPdf, type PdfPage, type PdfText } from "@/themes/testing/read-pdf";
import { MarginDocument } from "./margin-document";
import { PAGE_BOTTOM_MARGIN } from "./styles";

function marginPdf(resume: Resume) {
  const zones = placeSections(renderableView(resume).sections, layoutOf(resume, MARGIN_LAYOUT));
  return readPdf(<MarginDocument zones={zones} options={themeOptionsOf(resume, MARGIN_DEFAULT_OPTIONS)} />);
}

const [header] = sampleResume.content.sections;

/** A Resume of these Sections, laid out by this Layout (Sections it leaves out go where Margin's default puts them). */
function resumeOf(sections: Section[], layout: Layout | null = null): Resume {
  return {
    ...sampleResume,
    themeSettings: { ...sampleResume.themeSettings, layout },
    content: { sections },
  };
}

function summary(text: string): Section {
  return {
    id: "summary",
    type: "summary",
    title: "Summary",
    enabled: true,
    entries: [{ id: "summary-1", enabled: true, text }],
  };
}

function experience(entries: ExperienceEntry[], id = "experience"): Section {
  return { id, type: "experience", title: "Professional Experience", enabled: true, entries };
}

function experienceEntry(role: string, bullets: string[]): ExperienceEntry {
  return {
    id: role,
    enabled: true,
    company: "Paystream",
    role,
    location: "London",
    dates: { start: { year: 2022, month: 3, day: null }, current: true, end: null },
    bullets: bullets.map((text, i) => ({ id: `${role}-${i}`, enabled: true, text, children: [] })),
  };
}

/** Entries of 1 to 4 Bullets each, so that, somewhere, one starts near the bottom of a page. */
function manyEntries(count: number, prefix = "Role"): ExperienceEntry[] {
  return Array.from({ length: count }, (_, i) => {
    const n = String(i + 1).padStart(2, "0");
    return experienceEntry(
      `${prefix}-${n}`,
      Array.from({ length: (i % 4) + 1 }, (_, j) => `${prefix}Point-${n}-${j + 1} of a long Resume.`),
    );
  });
}

/** A Skills Section of `rows` Skills Entries. */
function skills(rows: number): SkillsSection {
  return {
    id: "skills",
    type: "skills",
    title: "Skills",
    enabled: true,
    entries: Array.from({ length: rows }, (_, i) => ({
      id: `skill-${i}`,
      enabled: true,
      label: `Label-${i + 1}`,
      skills: "Go, Python",
    })),
  };
}

/** Text without its spaces and line breaks. pdf.js reads letter-spaced headings with gaps ("SU M M A RY"). */
function squash(text: string): string {
  return text.replace(/\s+/g, "");
}

/** Where on which page a piece of text was drawn. */
function finder(pages: PdfPage[]) {
  const pageOf = (text: string) => pages.findIndex((page) => squash(pageText(page)).includes(squash(text)));
  const runOf = (text: string): PdfText => {
    const page = pages[pageOf(text)];
    const run = page?.text.find((run) => squash(run.text).includes(squash(text)));
    if (!run) throw new Error(`"${text}" isn't drawn in one run`);
    return run;
  };
  return { pageOf, runOf };
}

/** Where each column starts, in pt from the page's left edge: the sidebar at the margin, `main` 164 + 28 pt on. */
const SIDEBAR_X = 48;
const MAIN_X = 48 + 164 + 28;

// A4 in pt.
const A4 = { width: 595.28, height: 841.89 };

/**
 * Whether two baselines are one line: an Entry's smaller dates sit up to
 * 1pt off the main facts beside them.
 */
function sameLine(a: PdfText, b: PdfText): boolean {
  return Math.abs(a.y - b.y) < 1.5;
}

/** Every run drawn inside the page's margins, none past the bottom one. */
function expectInsideMargins(pages: PdfPage[], label: string) {
  for (const [number, page] of pages.entries()) {
    for (const run of page.text) {
      // y is the text's baseline.
      expect(run.y, `${label}, page ${number + 1}: "${run.text}"`).toBeLessThanOrEqual(page.height - PAGE_BOTTOM_MARGIN);
      expect(run.y, `${label}, page ${number + 1}: "${run.text}"`).toBeGreaterThan(46);
    }
  }
}

describe("MarginDocument", () => {
  test("draws the Resume on an A4 page, as selectable text", async () => {
    const [page] = await marginPdf(sampleResume);

    expect(page.width).toBeCloseTo(A4.width, 1);
    expect(page.height).toBeCloseTo(A4.height, 1);
    expect(pageText(page)).toContain("Maya Okafor");
  });

  test("draws the Header, every Default Section and Custom Sections in their Zones", async () => {
    const pages = await marginPdf(sampleResume);
    const { pageOf, runOf } = finder(pages);
    const inHeader = ["Maya Okafor", "maya.okafor@example.com", "GitHub", "SUMMARY", "Backend engineer with"];
    const inSidebar = ["SKILLS", "Languages", "Go, Python, SQL, TypeScript", "EDUCATION", "University of Manchester"];
    const inMain = [
      "PROFESSIONAL EXPERIENCE",
      "PROJECTS",
      "Ledgerly",
      "TALKS",
      "Idempotency at scale",
    ];

    for (const text of [...inHeader, ...inSidebar, ...inMain]) expect(pageOf(text), text).toBe(0);
    const columnsTop = Math.min(...[...inSidebar, ...inMain].map((text) => runOf(text).y));
    for (const text of inHeader) expect(runOf(text).y, text).toBeLessThan(columnsTop);
    for (const text of ["Maya Okafor", "SUMMARY", "Backend engineer with"]) {
      expect(runOf(text).x, text).toBeCloseTo(SIDEBAR_X, 0);
    }
    for (const text of inSidebar) expect(runOf(text).x, text).toBeCloseTo(SIDEBAR_X, 0);
    for (const text of inMain) expect(runOf(text).x, text).toBeCloseTo(MAIN_X, 0);
    expect(runOf("SKILLS").y).toBeCloseTo(runOf("PROFESSIONAL EXPERIENCE").y, 0);
  });

  test("draws a Section in the Zone the Layout puts it in", async () => {
    const resume = resumeOf(sampleResume.content.sections, {
      "aside-left": ["projects"],
      main: ["skills", "education"],
    });
    const { runOf } = finder(await marginPdf(resume));

    expect(runOf("Ledgerly").x).toBeCloseTo(SIDEBAR_X, 0);
    expect(runOf("Languages").x).toBeCloseTo(MAIN_X, 0);
    expect(runOf("University of Manchester").x).toBeCloseTo(MAIN_X, 0);
  });

  test("draws Skills with each label above its list", async () => {
    const { runOf } = finder(await marginPdf(sampleResume));

    expect(runOf("Go, Python, SQL, TypeScript").y).toBeGreaterThan(runOf("Languages").y);
    expect(runOf("Go, Python, SQL, TypeScript").x).toBeCloseTo(runOf("Languages").x, 0);
  });

  test("draws Education as the school, then the degree, then the place, years and results", async () => {
    const pages = await marginPdf(sampleResume);
    const { runOf } = finder(pages);
    // The last line wraps in the 164pt sidebar, so it's checked by where it starts.
    const lines = ["University of Manchester", "BSc Computer Science", "2013 – 2017"];

    const ys = lines.map((text) => runOf(text).y);
    expect(ys).toEqual([...ys].sort((a, b) => a - b));
    expect(new Set(ys).size).toBe(3);
    expect(squash(pageText(pages[0]))).toContain(squash("Manchester, UK · 2013 – 2017 · First-class honours"));
    expect(runOf("University of Manchester").font).toBe("SourceSerif4-SemiBold");
  });

  test("moves an Entry's dates below its main line when they don't fit beside it", async () => {
    const sections = [header, experience([experienceEntry("Platform-Lead", ["Built it."])]), skills(1)];
    const sidebar = finder(await marginPdf(resumeOf(sections, { "aside-left": ["experience"], main: ["skills"] })));
    const main = finder(await marginPdf(resumeOf(sections, { "aside-left": ["skills"], main: ["experience"] })));

    // In the 164pt sidebar, the dates go on the next line, at its left edge.
    expect(sidebar.runOf("London · Mar 2022 – Present").y).toBeGreaterThan(sidebar.runOf("Platform-Lead").y);
    expect(sidebar.runOf("London · Mar 2022 – Present").x).toBeCloseTo(SIDEBAR_X, 0);
    // In main, there's room for them beside it.
    expect(sameLine(main.runOf("London · Mar 2022 – Present"), main.runOf("Platform-Lead"))).toBe(true);
  });

  describe.each([
    ["serif", "SourceSerif4"],
    ["sans", "IBMPlexSans"],
    ["classic", "EBGaramond"],
  ] as const)("in the %s Typeface", (typeface, font) => {
    test("draws Prose in its fonts, with real bold, italic and bold italic", async () => {
      const resume = setThemeOption(resumeOf([header, summary("Plain, **bold**, *italic* and ***both***.")]), "typeface", typeface);
      const [page] = await marginPdf(resume);
      const fontOf = (text: string) => page.text.find((run) => run.text.includes(text))?.font;

      expect(fontOf("Plain")).toBe(`${font}-Regular`);
      expect(fontOf("bold")).toBe(`${font}-SemiBold`);
      expect(fontOf("italic")).toBe(`${font}-Italic`);
      expect(fontOf("both")).toBe(`${font}-SemiBoldItalic`);
    });
  });

  test("Compact Density sets lines closer: 1.32 of the 9.5 pt body text, against Comfortable's 1.42", async () => {
    const lineGap = async (resume: Resume) => {
      const { runOf } = finder(await marginPdf(resume));
      return runOf("Second line").y - runOf("First line").y;
    };
    const twoLines = resumeOf([header, summary("First line\nSecond line")]);

    expect(await lineGap(twoLines)).toBeCloseTo(13.49, 1);
    expect(await lineGap(setThemeOption(twoLines, "density", "compact"))).toBeCloseTo(12.54, 1);
  });

  test("Compact Density leaves less space below the header Zone: 20 pt against Comfortable's 30", async () => {
    const gap = async (resume: Resume) => {
      const { runOf } = finder(await marginPdf(resume));
      return runOf("SKILLS").y - runOf("Last-words").y;
    };
    const resume = resumeOf([header, summary("Last-words"), skills(1), experience(manyEntries(1))]);

    expect((await gap(resume)) - (await gap(setThemeOption(resume, "density", "compact")))).toBeCloseTo(
      10 + 13.49 - 12.54,
      0,
    );
  });

  test("starts the columns at the top margin when the header Zone draws nothing", async () => {
    const withHeader = finder(await marginPdf(resumeOf([header, skills(1), experience(manyEntries(1))])));
    const without = finder(
      await marginPdf(resumeOf([{ ...header, enabled: false }, skills(1), experience(manyEntries(1))])),
    );
    const startedOnItsOwn = finder(await marginPdf(resumeOf([experience(manyEntries(1))])));

    expect(without.runOf("SKILLS").y).toBeLessThan(withHeader.runOf("SKILLS").y);
    expect(without.runOf("PROFESSIONAL").y).toBeCloseTo(startedOnItsOwn.runOf("PROFESSIONAL").y, 0);
  });

  describe("when one column draws nothing", () => {
    const words = summary(Array.from({ length: 80 }, (_, i) => `word${i + 1}`).join(" "));
    /** How many words of the Summary fit on its first line. */
    const wordsOnFirstLine = async (resume: Resume) => {
      const [page] = await marginPdf(resume);
      return page.text.find((run) => run.text.startsWith("word1 "))?.text.trim().split(" ").length ?? 0;
    };

    test("gives main the full width", async () => {
      const beside = await wordsOnFirstLine(resumeOf([header, words, skills(1)], { main: ["summary"] }));
      const alone = await wordsOnFirstLine(
        resumeOf([header, words, { ...skills(1), enabled: false }], { main: ["summary"] }),
      );
      const { runOf } = finder(
        await marginPdf(resumeOf([header, words, { ...skills(1), enabled: false }], { main: ["summary"] })),
      );

      expect(runOf("SUMMARY").x).toBeCloseTo(SIDEBAR_X, 0);
      // Beside the sidebar, main is 307pt wide; alone, it's the page's 499pt.
      expect(alone).toBeGreaterThan(beside * 1.4);
    });

    test("gives the sidebar the full width", async () => {
      const beside = await wordsOnFirstLine(
        resumeOf([header, words, experience(manyEntries(1))], { "aside-left": ["summary"] }),
      );
      const alone = await wordsOnFirstLine(resumeOf([header, words], { "aside-left": ["summary"] }));

      // Beside main, the sidebar is 164pt wide; alone, it's the page's 499pt.
      expect(alone).toBeGreaterThan(beside * 2);
    });
  });

  test("makes Header, Project and Prose links clickable", async () => {
    const [page] = await marginPdf(sampleResume);
    const urls = page.links.map((link) => link.url);

    expect(urls).toContain("https://github.com/example-maya");
    expect(urls).toContain("https://ledgerly.example.com");
    expect(urls).toContain("https://maya.example.com/talks/idempotency");
  });

  test("shows a link that isn't http(s) or mailto as plain text, not a link", async () => {
    const [page] = await marginPdf(
      resumeOf([header, summary("Write to [me](mailto:maya@example.com), not [there](javascript:alert(1)).")]),
    );
    const urls = page.links.map((link) => link.url);

    expect(urls).toContain("mailto:maya@example.com");
    expect(urls).not.toContain("javascript:alert(1)");
  });

  test("draws the header Zone on page 1 only", async () => {
    const pages = await marginPdf(resumeOf([header, summary("Opening-words."), skills(2), experience(manyEntries(40))]));

    expect(pages.length).toBeGreaterThan(1);
    expect(pageText(pages[0])).toContain("Maya Okafor");
    for (const page of pages.slice(1)) {
      expect(pageText(page)).not.toContain("Maya Okafor");
      expect(pageText(page)).not.toContain("Opening-words");
    }
  });

  test("starts each column on a later page at the top margin, whether an Entry or a Bullet comes first", async () => {
    // Where a line of body text starts on a later page: a long Summary
    // paragraph in the header Zone carries on there with no space above it.
    const [, summaryPage] = await marginPdf(
      resumeOf([header, summary(Array.from({ length: 1500 }, () => "word").join(" "))]),
    );
    const topLine = (runs: PdfText[]) => runs.reduce((top, run) => (run.y < top.y ? run : top));
    const expected = topLine(summaryPage.text.filter((run) => run.text.startsWith("word"))).y;

    // Entries of 1 to 4 Bullets in each column, behind more and more Skills
    // rows, so that later pages start with an Entry in some and a Bullet in others.
    const startedBy = new Set<string>();
    for (let rows = 0; rows < 6; rows++) {
      const pages = await marginPdf(
        resumeOf([header, skills(rows), experience(manyEntries(24, "Side"), "side"), experience(manyEntries(30))], {
          "aside-left": ["skills", "side"],
          main: ["experience"],
        }),
      );
      for (const [number, page] of pages.slice(1).entries()) {
        for (const inSidebar of [true, false]) {
          const body = page.text.filter(
            (run) => run.x < MAIN_X - 14 === inSidebar && /^(Role|Side)(Point)?-/.test(run.text),
          );
          if (body.length === 0) continue;
          const top = topLine(body);
          startedBy.add(top.text.includes("Point-") ? "a Bullet" : "an Entry");
          expect(top.y, `${rows} Skills, page ${number + 2}, ${inSidebar ? "sidebar" : "main"}: "${top.text}"`).toBeCloseTo(
            expected,
            1,
          );
        }
      }
    }
    expect(startedBy).toContain("an Entry");
    expect(startedBy).toContain("a Bullet");
  });

  test.each([
    ["main", "main"],
    ["the sidebar", "aside-left"],
  ] as const)("never leaves a Section's title alone at the bottom of a page in %s", async (_, zone) => {
    // Custom Sections of 1 to 3 short Entries, so that, somewhere, one starts near the bottom of a page.
    const sections: CustomSection[] = Array.from({ length: 30 }, (_, i) => {
      const n = String(i + 1).padStart(2, "0");
      return {
        id: `custom-${n}`,
        type: "custom",
        title: `Section-${n}`,
        enabled: true,
        entries: Array.from({ length: (i % 3) + 1 }, (_, j) => ({
          id: `custom-${n}-${j}`,
          enabled: true,
          title: `Entry-${n}-${j + 1}`,
          subtitle: "",
          dates: { start: null, current: false, end: null },
          bullets: [],
        })),
      };
    });
    const other = zone === "main" ? "aside-left" : "main";
    const pages = await marginPdf(
      resumeOf([header, skills(2), ...sections], { [zone]: sections.map((s) => s.id), [other]: ["skills"] }),
    );
    const { pageOf } = finder(pages);

    expect(pages.length).toBeGreaterThan(1);
    for (let i = 1; i <= sections.length; i++) {
      const n = String(i).padStart(2, "0");
      expect(pageOf(`SECTION-${n}`), `Section-${n}`).toBe(pageOf(`Entry-${n}-1`));
    }
    expectInsideMargins(pages, `30 Sections in ${zone}`);
  });

  test("breaks an Entry with many Bullets between Bullets in a column, keeping every one", async () => {
    const bullets = Array.from({ length: 70 }, (_, i) => `Point-${i + 1} of a very long Entry.`);
    const pages = await marginPdf(resumeOf([header, skills(2), experience([experienceEntry("Role-01", bullets)])]));
    const text = squash(pages.map(pageText).join(""));

    expect(pages.length).toBeGreaterThan(1);
    for (const bullet of bullets) expect(text).toContain(squash(bullet));
    expectInsideMargins(pages, "70 Bullets");
  });

  test("breaks a long Summary paragraph across pages in a column, starting it under its title", async () => {
    const words = Array.from({ length: 900 }, (_, i) => `word${i + 1}`).join(" ");
    const pages = await marginPdf(resumeOf([header, summary(words), skills(2)], { main: ["summary"] }));
    const { pageOf } = finder(pages);

    expect(pageOf("SUMMARY")).toBe(0);
    expect(pageOf("word1 word2")).toBe(0);
    expect(pageOf("word900")).toBeGreaterThan(0);
    expectInsideMargins(pages, "a long Summary");
  });

  test("never leaves a Summary's title alone at the bottom of a page in the sidebar", async () => {
    // More and more Skills rows above the Summary, so that, in one of them,
    // its title lands near the bottom of the first page.
    for (let rows = 14; rows <= 24; rows++) {
      const pages = await marginPdf(
        resumeOf(
          [header, skills(rows), summary("Opening-words of a Summary that runs over a few lines. ".repeat(4)), experience(manyEntries(1))],
          { "aside-left": ["skills", "summary"] },
        ),
      );
      const { pageOf } = finder(pages);

      expect(pageOf("SUMMARY"), `${rows} Skills`).toBe(pageOf("Opening-words"));
    }
  });

  test("carries main on onto later pages in its own place after the sidebar has ended", async () => {
    const pages = await marginPdf(resumeOf([header, skills(2), experience(manyEntries(40))]));
    const { pageOf, runOf } = finder(pages);

    expect(pages.length).toBeGreaterThan(2);
    expect(pageOf("Label-2")).toBe(0);
    for (let i = 1; i <= 40; i++) {
      const n = String(i).padStart(2, "0");
      expect(runOf(`Role-${n}`).x, `Role-${n}`).toBeCloseTo(MAIN_X, 0);
      // An Entry's first line never sits alone at the bottom of a page.
      expect(pageOf(`Role-${n}`), `Role-${n}`).toBe(pageOf(`RolePoint-${n}-1`));
    }
    expect(pageOf("PROFESSIONAL")).toBe(pageOf("Role-01"));
    expectInsideMargins(pages, "40 Entries");
  });

  test("carries the sidebar on onto later pages in its own place after main has ended", async () => {
    const pages = await marginPdf(
      resumeOf([header, experience(manyEntries(1)), experience(manyEntries(40, "Side"), "side")], {
        "aside-left": ["side"],
        main: ["experience"],
      }),
    );
    const { pageOf, runOf } = finder(pages);

    expect(pages.length).toBeGreaterThan(2);
    expect(pageOf("Role-01")).toBe(0);
    for (let i = 1; i <= 40; i++) {
      const n = String(i).padStart(2, "0");
      expect(runOf(`Side-${n}`).x, `Side-${n}`).toBeCloseTo(SIDEBAR_X, 0);
      expect(pageOf(`Side-${n}`), `Side-${n}`).toBe(pageOf(`SidePoint-${n}-1`));
    }
    expectInsideMargins(pages, "40 sidebar Entries");
  });

  test("never draws past the bottom margin or over other text, however long each column is", async () => {
    // Different lengths of each column, so that each starts its later
    // Entries, Bullets and Section titles at the bottom of a page.
    for (let sideEntries = 6; sideEntries <= 14; sideEntries += 4) {
      for (let talks = 1; talks <= 9; talks += 2) {
        const custom: CustomSection = {
          id: "custom-talks",
          type: "custom",
          title: "Talks",
          enabled: true,
          entries: Array.from({ length: talks }, (_, i) => ({
            id: `talk-${i}`,
            enabled: true,
            title: `Talk-${i + 1}`,
            subtitle: "",
            dates: { start: null, current: false, end: null },
            bullets: [],
          })),
        };
        const label = `${sideEntries} sidebar Entries, ${talks} Talks`;
        const pages = await marginPdf(
          resumeOf(
            [header, summary("A short summary."), experience(manyEntries(sideEntries, "Side"), "side"), custom, experience(manyEntries(12))],
            { "aside-left": ["side"], main: ["custom-talks", "experience"] },
          ),
        );
        const { pageOf } = finder(pages);

        expectInsideMargins(pages, label);
        expect(pageOf("PROFESSIONAL"), label).toBe(pageOf("Role-01"));
        for (const page of pages) {
          // Within a column, two baselines are either one line (see sameLine)
          // or at least a line of small text apart, never drawn over each other.
          for (const inSidebar of [true, false]) {
            const ys = page.text.filter((run) => run.x < MAIN_X - 14 === inSidebar).map((run) => run.y);
            const lines = [...new Set(ys)].sort((a, b) => a - b);
            for (let i = 1; i < lines.length; i++) {
              const apart = lines[i] - lines[i - 1];
              expect(apart < 1.5 || apart > 8, `${label}: lines at ${lines[i - 1]} and ${lines[i]}`).toBe(true);
            }
          }
        }
      }
    }
  });

  test("leaves out what the renderable view dropped", async () => {
    const pages = await marginPdf(sampleResume);
    const text = pages.map(pageText).join("");

    expect(text).not.toContain("+44 7700 900123");
    expect(text).not.toContain("Brightside Web Studio");
    expect(text).not.toContain("VOLUNTEERING");
  });
});
