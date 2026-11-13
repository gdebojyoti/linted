import { describe, expect, test } from "vitest";
import { renderableView } from "@/lib/resume/renderable-view";
import { sampleResume } from "@/lib/resume/sample-resume";
import type { CustomSection, ExperienceEntry, Resume, SkillsSection } from "@/lib/resume/types";
import { layoutOf } from "@/lib/resume/layout";
import { placeSections } from "@/lib/theme/place-sections";
import { pageText, readPdf, type PdfPage } from "@/themes/testing/read-pdf";
import { setThemeOption, themeOptionsOf } from "@/lib/resume/theme-options";
import { LEDGER_DEFAULT_OPTIONS } from "@/themes/ledger/default-options";
import { LEDGER_LAYOUT } from "@/themes/ledger/default-layout";
import { LedgerDocument } from "./ledger-document";
import { PAGE_BOTTOM_MARGIN } from "./styles";

function ledgerPdf(resume: Resume) {
  const zones = placeSections(renderableView(resume).sections, layoutOf(resume, LEDGER_LAYOUT));
  return readPdf(<LedgerDocument zones={zones} options={themeOptionsOf(resume, LEDGER_DEFAULT_OPTIONS)} />);
}

/** A Resume with just a Header and a Summary of this one Prose text. */
function withSummary(text: string): Resume {
  return {
    ...sampleResume,
    content: {
      sections: [
        sampleResume.content.sections[0],
        {
          id: "summary",
          type: "summary",
          title: "Summary",
          enabled: true,
          entries: [{ id: "summary-1", enabled: true, text }],
        },
      ],
    },
  };
}

/** A Resume with just a Header and an Experience Section of these Entries. */
function withExperience(entries: ExperienceEntry[]): Resume {
  return {
    ...sampleResume,
    content: {
      sections: [
        sampleResume.content.sections[0],
        {
          id: "experience",
          type: "experience",
          title: "Professional Experience",
          enabled: true,
          entries,
        },
      ],
    },
  };
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

/** A Skills Section of `rows` Skills Entries, one line each. */
function skillsSection(rows: number): SkillsSection {
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

/**
 * Text without its spaces and line breaks. pdf.js reads letter-spaced
 * headings with gaps ("SU M M A RY") and joins wrapped lines without one.
 */
function squash(text: string): string {
  return text.replace(/\s+/g, "");
}

// A4 in pt.
const A4 = { width: 595.28, height: 841.89 };

describe("LedgerDocument", () => {
  test("draws the Resume on an A4 page, as selectable text", async () => {
    const [page] = await ledgerPdf(sampleResume);

    expect(page.width).toBeCloseTo(A4.width, 1);
    expect(page.height).toBeCloseTo(A4.height, 1);
    expect(pageText(page)).toContain("Maya Okafor");
  });

  test("draws the Header, every Default Section and Custom Sections, in order", async () => {
    const [page] = await ledgerPdf(sampleResume);
    const text = squash(pageText(page));

    const inOrder = [
      "Maya Okafor",
      "Senior Backend Engineer",
      "maya.okafor@example.com",
      "London, UK",
      "GitHub",
      "LinkedIn",
      "SUMMARY",
      "Backend engineer with 8 years building payment",
      "PROFESSIONAL EXPERIENCE",
      "Senior Backend Engineer, Paystream",
      "London, UK (hybrid) · Mar 2022 – Present",
      "Backend Engineer, Northwind Analytics",
      "PROJECTS",
      "Ledgerly — Go, Postgres, HTMX",
      "ledgerly.example.com · Jan 2024 – Present",
      "tokenbucket — Go",
      "SKILLS",
      "Languages",
      "Go, Python, SQL, TypeScript",
      "EDUCATION",
      "University of Manchester",
      "Manchester, UK · 2013 – 2017",
      "BSc Computer Science",
      "First-class honours",
      "TALKS",
      "Idempotency at scale — GopherCon UK",
      "14 Aug 2025",
      "From monolith to services without a big bang — London Go Meetup",
    ];
    const positions = inOrder.map((part) => text.indexOf(squash(part)));
    expect(positions).not.toContain(-1);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
  });

  test("draws Prose in Source Serif 4, with real bold and italic fonts", async () => {
    const [page] = await ledgerPdf(sampleResume);
    const fontOf = (text: string) => page.text.find((run) => run.text.includes(text))?.font;

    expect(fontOf("Backend engineer with")).toBe("SourceSerif4-Regular");
    expect(fontOf("8 years")).toBe("SourceSerif4-SemiBold");
    expect(fontOf("boring")).toBe("SourceSerif4-Italic");
    expect(fontOf("Consistency trade-offs")).toBe("SourceSerif4-Italic");
  });

  test("draws bold italic Prose in the bold italic font", async () => {
    const [page] = await ledgerPdf(withSummary("Shipped ***fast*** and safely."));
    const fontOf = (text: string) => page.text.find((run) => run.text.includes(text))?.font;

    expect(fontOf("fast")).toBe("SourceSerif4-SemiBoldItalic");
  });

  describe.each([
    ["sans", "IBMPlexSans"],
    ["classic", "EBGaramond"],
  ] as const)("in the %s Typeface", (typeface, font) => {
    test("draws Prose in its fonts, with real bold, italic and bold italic", async () => {
      const resume = setThemeOption(withSummary("Plain, **bold**, *italic* and ***both***."), "typeface", typeface);
      const [page] = await ledgerPdf(resume);
      const fontOf = (text: string) => page.text.find((run) => run.text.includes(text))?.font;

      expect(fontOf("Plain")).toBe(`${font}-Regular`);
      expect(fontOf("bold")).toBe(`${font}-SemiBold`);
      expect(fontOf("italic")).toBe(`${font}-Italic`);
      expect(fontOf("both")).toBe(`${font}-SemiBoldItalic`);
    });
  });

  test("Compact Density sets lines closer: 1.32 of the 9.5 pt body text, against Comfortable's 1.42", async () => {
    const lineGap = async (resume: Resume) => {
      const [page] = await ledgerPdf(resume);
      const y = (text: string) => page.text.find((run) => run.text.includes(text))!.y;
      return y("Second line") - y("First line");
    };
    const twoLines = withSummary("First line\nSecond line");

    expect(await lineGap(twoLines)).toBeCloseTo(13.49, 1);
    expect(await lineGap(setThemeOption(twoLines, "density", "compact"))).toBeCloseTo(12.54, 1);
  });

  test("makes Header, Project and Prose links clickable", async () => {
    const [page] = await ledgerPdf(sampleResume);

    expect(page.links.map((link) => link.url)).toEqual([
      "https://github.com/example-maya",
      "https://www.linkedin.com/in/example-maya",
      "https://ledgerly.example.com",
      "https://github.com/example-maya/tokenbucket",
      "https://maya.example.com/tokenbucket",
      "https://maya.example.com/talks/idempotency",
    ]);
  });

  test("shows a link that isn't http(s) or mailto as plain text, not a link", async () => {
    const [page] = await ledgerPdf(
      withSummary("Write to [me](mailto:maya@example.com), not [there](javascript:alert(1))."),
    );

    expect(page.links.map((link) => link.url)).toContain("mailto:maya@example.com");
    expect(page.links.map((link) => link.url)).not.toContain("javascript:alert(1)");
  });

  test("breaks a long Resume across pages, never leaving an Entry's first line alone at the bottom", async () => {
    // Entries of 1 to 4 Bullets, so that, somewhere, one starts near the bottom of a page.
    const entries = Array.from({ length: 40 }, (_, i) => {
      const n = String(i + 1).padStart(2, "0");
      return experienceEntry(
        `Role-${n}`,
        Array.from({ length: (i % 4) + 1 }, (_, j) => `Bullet-${n}-${j + 1} of a long Resume.`),
      );
    });
    const pages = await ledgerPdf(withExperience(entries));
    const pageOf = (text: string) =>
      pages.findIndex((page) => squash(pageText(page)).includes(squash(text)));

    expect(pages.length).toBeGreaterThan(2);
    expect(pageOf("PROFESSIONAL")).toBe(pageOf("Role-01"));
    for (let i = 1; i <= entries.length; i++) {
      const n = String(i).padStart(2, "0");
      expect(pageOf(`Role-${n}`), `Role-${n}`).toBe(pageOf(`Bullet-${n}-1`));
    }
  });

  test("never leaves a Section's title alone at the bottom of a page", async () => {
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
    const pages = await ledgerPdf({
      ...sampleResume,
      content: { sections: [sampleResume.content.sections[0], ...sections] },
    });
    const pageOf = (text: string) =>
      pages.findIndex((page) => squash(pageText(page)).includes(squash(text)));

    expect(pages.length).toBeGreaterThan(1);
    for (let i = 1; i <= sections.length; i++) {
      const n = String(i).padStart(2, "0");
      expect(pageOf(`SECTION-${n}`), `Section-${n}`).toBe(pageOf(`Entry-${n}-1`));
    }
  });

  test("never draws a Section past the bottom margin, wherever on the page it starts (#100)", async () => {
    // More and more Skills rows above a Custom Section, so that its title,
    // its Entry and each of its Bullets in turn land at the bottom of page 1.
    for (let skills = 34; skills <= 46; skills++) {
      const pages = await ledgerPdf({
        ...sampleResume,
        content: {
          sections: [
            sampleResume.content.sections[0],
            skillsSection(skills),
            {
              id: "custom-talks",
              type: "custom",
              title: "Talks",
              enabled: true,
              entries: [
                {
                  id: "talk-1",
                  enabled: true,
                  title: "Talk-Title",
                  subtitle: "",
                  dates: { start: null, current: false, end: null },
                  bullets: ["First-point", "Second-point", "Third-point"].map((text) => ({
                    id: text,
                    enabled: true,
                    text,
                    children: [],
                  })),
                },
              ],
            },
          ],
        },
      });
      const pageOf = (text: string) =>
        pages.findIndex((page) => squash(pageText(page)).includes(squash(text)));
      const yOf = (text: string) =>
        pages[pageOf(text)].text.find((run) => squash(run.text).includes(squash(text)))!.y;

      for (const [number, page] of pages.entries()) {
        for (const run of page.text) {
          // y is the text's baseline.
          expect(run.y, `${skills} Skills, page ${number + 1}: "${run.text}"`).toBeLessThanOrEqual(
            page.height - PAGE_BOTTOM_MARGIN,
          );
        }
      }
      expect(pageOf("TALKS"), `${skills} Skills`).toBe(pageOf("Talk-Title"));
      expect(pageOf("Talk-Title"), `${skills} Skills`).toBe(pageOf("First-point"));
      // Bullets keep their order, never drawn over one another.
      const order = ["First-point", "Second-point", "Third-point"].map((text) => [pageOf(text), yOf(text)]);
      for (let i = 1; i < order.length; i++) {
        const [page, y] = order[i];
        const [pageBefore, yBefore] = order[i - 1];
        expect(page > pageBefore || (page === pageBefore && y > yBefore), `${skills} Skills, Bullet ${i + 1}`).toBe(true);
      }
    }
  });

  test("starts a later page at its top margin, whether an Entry or a Bullet comes first", async () => {
    // Where a line of body text starts on a later page: a long Summary
    // paragraph carries on there with no space of its own above it.
    const [, summaryPage] = await ledgerPdf(withSummary(Array.from({ length: 1200 }, () => "word").join(" ")));
    // The page's first line in body text, leaving out smaller text such as dates.
    const topLine = (page: PdfPage) =>
      page.text
        .filter((run) => /^(word|Role-|Bullet-)/.test(run.text))
        .reduce((top, run) => (run.y < top.y ? run : top));
    const expected = topLine(summaryPage).y;

    // Entries of 1 to 4 Bullets, behind more and more Skills rows, so that
    // later pages start with an Entry in some and with a Bullet in others.
    const startedBy = new Set<string>();
    for (let skills = 0; skills < 8; skills++) {
      const entries = Array.from({ length: 30 }, (_, i) => {
        const n = String(i + 1).padStart(2, "0");
        return experienceEntry(
          `Role-${n}`,
          Array.from({ length: (i % 4) + 1 }, (_, j) => `Bullet-${n}-${j + 1} of a long Resume.`),
        );
      });
      const resume = withExperience(entries);
      const pages = await ledgerPdf({
        ...resume,
        content: { sections: [...resume.content.sections, skillsSection(skills)] },
      });
      const withSkillsFirst = await ledgerPdf({
        ...resume,
        content: {
          sections: [resume.content.sections[0], skillsSection(skills), resume.content.sections[1]],
        },
      });
      for (const [number, page] of [...pages.slice(1), ...withSkillsFirst.slice(1)].entries()) {
        const top = topLine(page);
        startedBy.add(top.text.startsWith("Bullet-") ? "a Bullet" : top.text.startsWith("Role-") ? "an Entry" : top.text);
        expect(top.y, `${skills} Skills, page ${number + 2}: "${top.text}"`).toBeCloseTo(expected, 1);
      }
    }
    expect(startedBy).toContain("an Entry");
    expect(startedBy).toContain("a Bullet");
  });

  test("breaks an Entry with many Bullets between Bullets, keeping every one", async () => {
    const bullets = Array.from({ length: 90 }, (_, i) => `Point-${i + 1} of a very long Entry.`);
    const pages = await ledgerPdf(withExperience([experienceEntry("Role-01", bullets)]));
    const text = pages.map(pageText).join("");

    expect(pages.length).toBeGreaterThan(1);
    for (const bullet of bullets) expect(text).toContain(bullet);
  });

  test("breaks a long Summary paragraph across pages, starting it under its title", async () => {
    const words = Array.from({ length: 1200 }, (_, i) => `word${i + 1}`).join(" ");
    const pages = await ledgerPdf(withSummary(words));
    const pageOf = (text: string) =>
      pages.findIndex((page) => squash(pageText(page)).includes(squash(text)));

    expect(pageOf("SUMMARY")).toBe(0);
    expect(pageOf("word1 word2 word3")).toBe(0);
    expect(pageOf("word1200")).toBeGreaterThan(0);
  });

  test("never leaves a Summary's title alone at the bottom of a page", async () => {
    // Different amounts of Talks above the Summary, so that, in one of them,
    // the title lands near the bottom of the first page.
    for (let talks = 18; talks <= 30; talks++) {
      const custom: CustomSection = {
        id: "custom-talks",
        type: "custom",
        title: "Talks",
        enabled: true,
        entries: Array.from({ length: talks }, (_, i) => ({
          id: `talk-${i}`,
          enabled: true,
          title: `Talk ${i + 1}`,
          subtitle: "",
          dates: { start: null, current: false, end: null },
          bullets: [],
        })),
      };
      const summary = withSummary("Opening-words of a Summary that runs over a few lines. ".repeat(6));
      const pages = await ledgerPdf({
        ...summary,
        content: { sections: [summary.content.sections[0], custom, summary.content.sections[1]] },
      });
      const pageOf = (text: string) =>
        pages.findIndex((page) => squash(pageText(page)).includes(squash(text)));

      expect(pageOf("SUMMARY"), `${talks} Talks`).toBe(pageOf("Opening-words"));
    }
  });

  test("keeps the line breaks typed in a Summary", async () => {
    const [page] = await ledgerPdf(withSummary("First line\nSecond line"));
    const yOf = (text: string) => page.text.find((run) => run.text.includes(text))?.y ?? 0;

    expect(yOf("Second line")).toBeGreaterThan(yOf("First line"));
  });

  test("leaves out what the renderable view dropped", async () => {
    const [page] = await ledgerPdf(sampleResume);
    const text = pageText(page);

    expect(text).not.toContain("+44 7700 900123");
    expect(text).not.toContain("Brightside Web Studio");
    expect(text).not.toContain("VOLUNTEERING");
  });
});
