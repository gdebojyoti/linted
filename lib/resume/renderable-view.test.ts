import { describe, expect, test } from "vitest";
import { newResume } from "./new-resume";
import { renderableView, type RenderedSection } from "./renderable-view";
import { sampleResume } from "./sample-resume";
import type {
  Bullet,
  CustomEntry,
  CustomSection,
  DateRange,
  EducationEntry,
  EducationSection,
  ExperienceEntry,
  ExperienceSection,
  HeaderSection,
  ProjectEntry,
  ProjectsSection,
  Resume,
  Section,
  SectionType,
  Skill,
  SkillsEntry,
  SkillsSection,
  SummaryEntry,
  SummarySection,
} from "./types";

function sequentialIds() {
  let n = 0;
  return () => `id-${++n}`;
}

function emptyResume() {
  return newResume({ now: new Date("2026-09-26T10:00:00.000Z"), newId: sequentialIds() });
}

function resumeWith(...sections: Section[]): Resume {
  return { ...emptyResume(), content: { sections } };
}

function summary(entries: SummaryEntry[], overrides: Partial<SummarySection> = {}): SummarySection {
  return { id: "summary", type: "summary", title: "Summary", enabled: true, entries, ...overrides };
}

function summaryEntry(text: string, overrides: Partial<SummaryEntry> = {}): SummaryEntry {
  return { id: `summary-${text}`, enabled: true, text, ...overrides };
}

const noDates: DateRange = { start: null, current: false, end: null };

function experience(entries: ExperienceEntry[]): ExperienceSection {
  return { id: "experience", type: "experience", title: "Experience", enabled: true, entries };
}

function experienceEntry(overrides: Partial<ExperienceEntry> = {}): ExperienceEntry {
  return {
    id: "job",
    enabled: true,
    company: "",
    role: "",
    location: "",
    dates: noDates,
    bullets: [],
    ...overrides,
  };
}

function bullet(text: string, children: Bullet[] = [], overrides: Partial<Bullet> = {}): Bullet {
  return { id: `bullet-${text}`, enabled: true, text, children, ...overrides };
}

/** The Bullets of the first Entry of the first rendered Section. */
function renderedBullets(bullets: Bullet[]) {
  const [section] = renderableView(resumeWith(experience([experienceEntry({ company: "Acme", bullets })]))).sections;
  if (section?.type !== "experience") throw new Error("expected the Experience Section to render");
  return section.entries[0].bullets;
}

function skills(entries: SkillsEntry[]): SkillsSection {
  return { id: "skills", type: "skills", title: "Skills", enabled: true, entries };
}

function skillsEntry(label: string, names: string[], overrides: Partial<SkillsEntry> = {}): SkillsEntry {
  return { id: `skills-${label}`, enabled: true, label, skills: names.map((name) => skill(name)), ...overrides };
}

function skill(name: string, overrides: Partial<Skill> = {}): Skill {
  return { id: `skill-${name}`, enabled: true, name, ...overrides };
}

function projects(entries: ProjectEntry[]): ProjectsSection {
  return { id: "projects", type: "projects", title: "Projects", enabled: true, entries };
}

function education(entries: EducationEntry[]): EducationSection {
  return { id: "education", type: "education", title: "Education", enabled: true, entries };
}

function custom(entries: CustomEntry[]): CustomSection {
  return { id: "talks", type: "custom", title: "Talks", enabled: true, entries };
}

function header(overrides: Partial<HeaderSection> = {}): HeaderSection {
  return {
    id: "header",
    type: "header",
    title: "Header",
    enabled: true,
    pinned: true,
    name: "",
    headline: "",
    entries: [],
    ...overrides,
  };
}

describe("renderableView", () => {
  test("a new Resume renders no Sections, since all of them are Empty", () => {
    expect(renderableView(emptyResume()).sections).toEqual([]);
  });

  test("a filled Section renders with its id, type and title, without Enabled flags", () => {
    const resume = resumeWith(summary([summaryEntry("Backend engineer.")], { title: "About" }));

    expect(renderableView(resume).sections).toEqual([
      {
        id: "summary",
        type: "summary",
        title: "About",
        entries: [{ id: "summary-Backend engineer.", text: "Backend engineer." }],
      },
    ]);
  });

  describe("Enabled cascade", () => {
    test("a Disabled Section is left out, however filled it is", () => {
      const resume = resumeWith(summary([summaryEntry("Backend engineer.")], { enabled: false }));

      expect(renderableView(resume).sections).toEqual([]);
    });

    test("a Disabled Entry is left out, and its Section still renders its other Entries", () => {
      const resume = resumeWith(
        summary([summaryEntry("Kept."), summaryEntry("Dropped.", { enabled: false })]),
      );

      expect(renderableView(resume).sections[0].entries).toEqual([
        { id: "summary-Kept.", text: "Kept." },
      ]);
    });

    test("a Section whose Entries are all Disabled is left out", () => {
      const resume = resumeWith(summary([summaryEntry("Dropped.", { enabled: false })]));

      expect(renderableView(resume).sections).toEqual([]);
    });

    test("never changes the stored Resume, so re-Enabling a parent brings its children back as they were", () => {
      const resume = structuredClone(sampleResume);

      renderableView(resume);

      expect(resume).toEqual(sampleResume);
    });
  });

  test("Sections keep the Content's order", () => {
    const resume = resumeWith(
      skills([skillsEntry("Languages", ["Go"])]),
      header({ name: "Maya Okafor" }),
      summary([summaryEntry("Backend engineer.")]),
    );

    expect(renderableView(resume).sections.map((s) => s.type)).toEqual(["skills", "header", "summary"]);
  });

  test("the sample Resume renders only its Enabled, filled Content", () => {
    const { sections } = renderableView(sampleResume);
    const ids = (items: { id: string }[]) => items.map((item) => item.id);
    const section = <T extends SectionType>(type: T) => {
      const found = sections.find((s): s is Extract<RenderedSection, { type: T }> => s.type === type);
      if (!found) throw new Error(`expected the ${type} Section to render`);
      return found;
    };

    expect(ids(sections)).toEqual(["header", "summary", "experience", "projects", "skills", "education", "custom-talks"]);
    expect(ids(section("header").entries)).toEqual(["contact-email", "contact-location", "contact-github", "contact-linkedin"]);
    expect(ids(section("summary").entries)).toEqual(["summary-backend"]);
    expect(ids(section("experience").entries)).toEqual(["exp-paystream", "exp-northwind"]);
    expect(ids(section("projects").entries)).toEqual(["proj-ledgerly", "proj-rate-limiter"]);
    expect(ids(section("skills").entries)).toEqual(["skills-languages", "skills-infra"]);

    const [paystream, northwind] = section("experience").entries;
    expect(ids(paystream.bullets)).toEqual(["exp-paystream-b1", "exp-paystream-b2", "exp-paystream-b3"]);
    expect(ids(paystream.bullets[0].children)).toEqual(["exp-paystream-b1-1"]);
    expect(ids(northwind.bullets)).toEqual(["exp-northwind-b1"]);

    const [languages] = section("skills").entries;
    expect(languages.skills.map((s) => s.name)).toEqual(["Go", "Python", "SQL", "TypeScript"]);
  });

  describe("Empty filtering", () => {
    test("an Entry with no text, or only whitespace, is Empty and left out", () => {
      const resume = resumeWith(
        summary([summaryEntry(""), summaryEntry("Kept."), summaryEntry("  \n\t ")]),
      );

      expect(renderableView(resume).sections[0].entries).toEqual([
        { id: "summary-Kept.", text: "Kept." },
      ]);
    });

    test("a Section with only Empty Entries is left out", () => {
      const resume = resumeWith(summary([summaryEntry(""), summaryEntry("   ")]));

      expect(renderableView(resume).sections).toEqual([]);
    });

    test("an Entry with any one field filled renders, and its unfilled fields come out as empty strings", () => {
      const resume = resumeWith(experience([experienceEntry({ role: "  ", location: "Leeds" })]));

      expect(renderableView(resume).sections[0].entries).toEqual([
        { id: "job", company: "", role: "", location: "Leeds", dates: noDates, bullets: [] },
      ]);
    });

    test("filled text is trimmed, though it is stored as typed", () => {
      const resume = resumeWith(
        header({ name: "  Maya Okafor ", headline: "Engineer\n" }),
        experience([experienceEntry({ company: " Acme ", bullets: [bullet(" Led ", [bullet("\tShipped ")])] })]),
        skills([skillsEntry(" Languages", [" Go "])]),
        summary([summaryEntry(" Backend engineer. ")]),
      );

      const [headerView, experienceView, skillsView, summaryView] = renderableView(resume).sections;

      expect(headerView).toMatchObject({ name: "Maya Okafor", headline: "Engineer" });
      expect(experienceView.entries[0]).toMatchObject({
        company: "Acme",
        bullets: [{ text: "Led", children: [{ text: "Shipped" }] }],
      });
      expect(skillsView.entries[0]).toMatchObject({ label: "Languages", skills: [{ name: "Go" }] });
      expect(summaryView.entries[0]).toMatchObject({ text: "Backend engineer." });
    });

    test("an Entry with only its dates filled renders", () => {
      const dates: DateRange = { start: { year: 2020, month: null, day: null }, current: true, end: null };
      const resume = resumeWith(experience([experienceEntry({ dates })]));

      expect(renderableView(resume).sections[0].entries).toEqual([
        { id: "job", company: "", role: "", location: "", dates, bullets: [] },
      ]);
    });

    test("an Entry with every field unfilled is Empty and left out", () => {
      const resume = resumeWith(experience([experienceEntry({ company: " ", role: "\t" })]));

      expect(renderableView(resume).sections).toEqual([]);
    });
  });

  describe("Bullets", () => {
    test("render at both levels, in order, without Enabled flags", () => {
      expect(renderedBullets([bullet("Led", [bullet("Planned"), bullet("Shipped")]), bullet("Mentored")])).toEqual([
        {
          id: "bullet-Led",
          text: "Led",
          children: [
            { id: "bullet-Planned", text: "Planned", children: [] },
            { id: "bullet-Shipped", text: "Shipped", children: [] },
          ],
        },
        { id: "bullet-Mentored", text: "Mentored", children: [] },
      ]);
    });

    test("a Disabled Bullet is left out, at either level", () => {
      const bullets = [
        bullet("Led", [bullet("Planned", [], { enabled: false }), bullet("Shipped")]),
        bullet("Mentored", [], { enabled: false }),
      ];

      expect(renderedBullets(bullets)).toEqual([
        { id: "bullet-Led", text: "Led", children: [{ id: "bullet-Shipped", text: "Shipped", children: [] }] },
      ]);
    });

    test("a Disabled parent Bullet takes its Enabled children with it", () => {
      expect(renderedBullets([bullet("Led", [bullet("Planned")], { enabled: false })])).toEqual([]);
    });

    test("an Empty Bullet with no renderable children is left out, at either level", () => {
      const bullets = [bullet("Led", [bullet(" ")]), bullet(""), bullet("  ", [bullet("Off", [], { enabled: false })])];

      expect(renderedBullets(bullets)).toEqual([{ id: "bullet-Led", text: "Led", children: [] }]);
    });

    test("an Empty parent Bullet with filled children renders as an empty Bullet holding them", () => {
      expect(renderedBullets([bullet("  ", [bullet("Planned")])])).toEqual([
        { id: "bullet-  ", text: "", children: [{ id: "bullet-Planned", text: "Planned", children: [] }] },
      ]);
    });

    test("Bullets alone are enough for an Entry to render", () => {
      const resume = resumeWith(experience([experienceEntry({ bullets: [bullet("Led")] })]));

      expect(renderableView(resume).sections).toHaveLength(1);
    });
  });

  describe("Skills", () => {
    test("Disabled and Empty Skills are left out", () => {
      const entry = skillsEntry("Languages", ["Go", " "]);
      entry.skills.push(skill("PHP", { enabled: false }));

      expect(renderableView(resumeWith(skills([entry]))).sections[0].entries).toEqual([
        { id: "skills-Languages", label: "Languages", skills: [{ id: "skill-Go", name: "Go" }] },
      ]);
    });

    test("a Skills Entry with a label but no renderable Skills is left out", () => {
      const resume = resumeWith(skills([skillsEntry("Languages", ["", "  "])]));

      expect(renderableView(resume).sections).toEqual([]);
    });

    test("a Skills Entry with Skills but no label renders with an empty label", () => {
      const resume = resumeWith(skills([skillsEntry(" ", ["Go"])]));

      expect(renderableView(resume).sections[0].entries).toEqual([
        { id: "skills- ", label: "", skills: [{ id: "skill-Go", name: "Go" }] },
      ]);
    });

    test("a Disabled Skills Entry takes its Enabled Skills with it", () => {
      const resume = resumeWith(skills([skillsEntry("Languages", ["Go"], { enabled: false })]));

      expect(renderableView(resume).sections).toEqual([]);
    });
  });

  describe("Header", () => {
    test("renders when only its name is filled, and stays Pinned", () => {
      const resume = resumeWith(header({ name: "Maya Okafor", headline: "  " }));

      expect(renderableView(resume).sections).toEqual([
        { id: "header", type: "header", title: "Header", pinned: true, name: "Maya Okafor", headline: "", entries: [] },
      ]);
    });

    test("renders when only its headline is filled", () => {
      const resume = resumeWith(header({ headline: "Backend Engineer" }));

      expect(renderableView(resume).sections).toHaveLength(1);
    });

    test("renders when only a contact item is filled", () => {
      const resume = resumeWith(
        header({ entries: [{ id: "email", enabled: true, kind: "email", value: "maya@example.com" }] }),
      );

      expect(renderableView(resume).sections[0].entries).toEqual([
        { id: "email", kind: "email", value: "maya@example.com" },
      ]);
    });

    test("Disabled and Empty contact items are left out", () => {
      const resume = resumeWith(
        header({
          name: "Maya Okafor",
          entries: [
            { id: "phone", enabled: false, kind: "phone", value: "+44 7700 900123" },
            { id: "location", enabled: true, kind: "location", value: " " },
            { id: "empty-link", enabled: true, kind: "link", label: "", value: "" },
            { id: "github", enabled: true, kind: "link", label: "GitHub", value: "https://github.com/maya" },
          ],
        }),
      );

      expect(renderableView(resume).sections[0].entries).toEqual([
        { id: "github", kind: "link", label: "GitHub", value: "https://github.com/maya" },
      ]);
    });

    test("a link with only its label or only its URL filled renders, the other coming out empty", () => {
      const resume = resumeWith(
        header({
          entries: [
            { id: "label-only", enabled: true, kind: "link", label: "Blog", value: "  " },
            { id: "url-only", enabled: true, kind: "link", label: "", value: "https://maya.example.com" },
          ],
        }),
      );

      expect(renderableView(resume).sections[0].entries).toEqual([
        { id: "label-only", kind: "link", label: "Blog", value: "" },
        { id: "url-only", kind: "link", label: "", value: "https://maya.example.com" },
      ]);
    });

    test("a Header with nothing filled is left out", () => {
      const resume = resumeWith(
        header({ name: " ", entries: [{ id: "email", enabled: true, kind: "email", value: "" }] }),
      );

      expect(renderableView(resume).sections).toEqual([]);
    });

    test("a Disabled Header is left out", () => {
      const resume = resumeWith(header({ name: "Maya Okafor", enabled: false }));

      expect(renderableView(resume).sections).toEqual([]);
    });
  });

  describe("Projects, Education and Custom Entries", () => {
    const emptyProject: ProjectEntry = {
      id: "project",
      enabled: true,
      name: "",
      link: "",
      techStack: "",
      dates: noDates,
      bullets: [],
    };
    const emptyDegree: EducationEntry = {
      id: "degree",
      enabled: true,
      institution: "",
      degree: "",
      location: "",
      dates: noDates,
      results: "",
      bullets: [],
    };
    const emptyCustom: CustomEntry = {
      id: "talk",
      enabled: true,
      title: "",
      subtitle: "",
      dates: noDates,
      bullets: [],
    };

    test("a Project with only its tech stack filled renders, unfilled fields empty", () => {
      const resume = resumeWith(projects([{ ...emptyProject, name: " ", techStack: "Go" }]));

      expect(renderableView(resume).sections[0].entries).toEqual([
        { id: "project", name: "", link: "", techStack: "Go", dates: noDates, bullets: [] },
      ]);
    });

    test("an Education Entry with only its results filled renders, unfilled fields empty", () => {
      const resume = resumeWith(education([{ ...emptyDegree, location: "\t", results: "First" }]));

      expect(renderableView(resume).sections[0].entries).toEqual([
        { id: "degree", institution: "", degree: "", location: "", dates: noDates, results: "First", bullets: [] },
      ]);
    });

    test("a Custom Entry with only its subtitle filled renders, unfilled fields empty", () => {
      const resume = resumeWith(custom([{ ...emptyCustom, title: " ", subtitle: "GopherCon UK" }]));

      expect(renderableView(resume).sections).toEqual([
        {
          id: "talks",
          type: "custom",
          title: "Talks",
          entries: [{ id: "talk", title: "", subtitle: "GopherCon UK", dates: noDates, bullets: [] }],
        },
      ]);
    });

    test("their Bullets render with the same rules", () => {
      const bullets = [bullet("Shipped"), bullet("Off", [], { enabled: false }), bullet(" ")];
      const resume = resumeWith(
        projects([{ ...emptyProject, bullets }]),
        education([{ ...emptyDegree, bullets }]),
        custom([{ ...emptyCustom, bullets }]),
      );
      const shipped = [{ id: "bullet-Shipped", text: "Shipped", children: [] }];

      expect(renderableView(resume).sections.map((s) => s.entries.map((e) => "bullets" in e && e.bullets))).toEqual([
        [shipped],
        [shipped],
        [shipped],
      ]);
    });

    test("Empty or Disabled ones are left out, and so are their Sections", () => {
      const resume = resumeWith(
        projects([emptyProject, { ...emptyProject, name: "Ledgerly", enabled: false }]),
        education([emptyDegree, { ...emptyDegree, degree: "BSc", enabled: false }]),
        custom([emptyCustom, { ...emptyCustom, title: "Talk", enabled: false }]),
      );

      expect(renderableView(resume).sections).toEqual([]);
    });
  });
});
