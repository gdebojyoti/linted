import { describe, expect, test } from "vitest";
import { renderableView } from "@/lib/resume/renderable-view";
import { sampleResume } from "@/lib/resume/sample-resume";
import type { CustomSection, ExperienceEntry, Resume } from "@/lib/resume/types";
import { placeSections } from "@/lib/theme/place-sections";
import { pageText, readPdf } from "@/themes/testing/read-pdf";
import { LEDGER_DEFAULT_LAYOUT } from "@/themes/ledger/default-layout";
import { LedgerDocument } from "./ledger-document";

function ledgerPdf(resume: Resume) {
  const zones = placeSections(renderableView(resume).sections, LEDGER_DEFAULT_LAYOUT);
  return readPdf(<LedgerDocument zones={zones} />);
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

  test("breaks an Entry with many Bullets between Bullets, keeping every one", async () => {
    const bullets = Array.from({ length: 90 }, (_, i) => `Point-${i + 1} of a very long Entry.`);
    const pages = await ledgerPdf(withExperience([experienceEntry("Role-01", bullets)]));
    const text = pages.map(pageText).join("");

    expect(pages.length).toBeGreaterThan(1);
    for (const bullet of bullets) expect(text).toContain(bullet);
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
