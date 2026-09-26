import type {
  Bullet,
  ContactEntry,
  CustomEntry,
  DateRange,
  EducationEntry,
  ExperienceEntry,
  ProjectEntry,
  Resume,
  Section,
  SkillsEntry,
  SummaryEntry,
} from "./types";

/**
 * A stored shape as a Theme receives it: every `enabled` flag is gone,
 * because everything left is drawn.
 */
export type Rendered<T> = T extends (infer Item)[]
  ? Rendered<Item>[]
  : T extends object
    ? { [K in keyof T as K extends "enabled" ? never : K]: Rendered<T[K]> }
    : T;

export type RenderedSection = Rendered<Section>;

/** Only the Content a Theme should draw. */
export type RenderableView = {
  sections: RenderedSection[];
};

/**
 * Turns a Resume into only the Content a Theme should draw. A Section, Entry,
 * Bullet or contact item is kept only if it and all its ancestors are
 * Enabled and it is not Empty. Text is trimmed, and unfilled fields of kept
 * items come out as "". Section order is the Content's; placing Sections is
 * the Theme's job (ADR 0005).
 */
export function renderableView(resume: Resume): RenderableView {
  return { sections: dropNulls(resume.content.sections.map(renderSection)) };
}

function renderSection(section: Section): RenderedSection | null {
  if (!section.enabled) return null;

  switch (section.type) {
    case "header": {
      const entries = dropNulls(section.entries.map(renderContactEntry));
      const name = trimmed(section.name);
      const headline = trimmed(section.headline);
      if (name === "" && headline === "" && entries.length === 0) return null;
      return {
        id: section.id,
        type: section.type,
        title: section.title,
        pinned: section.pinned,
        name,
        headline,
        entries,
      };
    }
    case "summary":
      return withEntries(section, section.entries.map(renderSummaryEntry));
    case "experience":
      return withEntries(section, section.entries.map(renderExperienceEntry));
    case "projects":
      return withEntries(section, section.entries.map(renderProjectEntry));
    case "skills":
      return withEntries(section, section.entries.map(renderSkillsEntry));
    case "education":
      return withEntries(section, section.entries.map(renderEducationEntry));
    case "custom":
      return withEntries(section, section.entries.map(renderCustomEntry));
  }
}

/** The Section with its rendered Entries, or null when none are left. */
function withEntries<S extends Section, E>(
  section: S,
  entries: (E | null)[],
): { id: string; type: S["type"]; title: string; entries: E[] } | null {
  const rendered = dropNulls(entries);
  return rendered.length > 0
    ? { id: section.id, type: section.type, title: section.title, entries: rendered }
    : null;
}

function renderContactEntry(entry: ContactEntry): Rendered<ContactEntry> | null {
  if (!entry.enabled) return null;
  if (entry.kind === "link") {
    const rendered = { id: entry.id, kind: entry.kind, label: trimmed(entry.label), value: trimmed(entry.value) };
    return rendered.label !== "" || rendered.value !== "" ? rendered : null;
  }
  return isFilled(entry.value) ? { id: entry.id, kind: entry.kind, value: trimmed(entry.value) } : null;
}

function renderSummaryEntry(entry: SummaryEntry): Rendered<SummaryEntry> | null {
  if (!entry.enabled || !isFilled(entry.text)) return null;
  return { id: entry.id, text: trimmed(entry.text) };
}

function renderExperienceEntry(entry: ExperienceEntry): Rendered<ExperienceEntry> | null {
  if (!entry.enabled) return null;
  const rendered = {
    id: entry.id,
    company: trimmed(entry.company),
    role: trimmed(entry.role),
    location: trimmed(entry.location),
    dates: entry.dates,
    bullets: renderBullets(entry.bullets),
  };
  return anyFilled(rendered, [rendered.company, rendered.role, rendered.location]) ? rendered : null;
}

function renderProjectEntry(entry: ProjectEntry): Rendered<ProjectEntry> | null {
  if (!entry.enabled) return null;
  const rendered = {
    id: entry.id,
    name: trimmed(entry.name),
    link: trimmed(entry.link),
    techStack: trimmed(entry.techStack),
    dates: entry.dates,
    bullets: renderBullets(entry.bullets),
  };
  return anyFilled(rendered, [rendered.name, rendered.link, rendered.techStack]) ? rendered : null;
}

function renderSkillsEntry(entry: SkillsEntry): Rendered<SkillsEntry> | null {
  if (!entry.enabled) return null;
  const rendered = { id: entry.id, label: trimmed(entry.label), skills: trimmed(entry.skills) };
  return rendered.label !== "" || rendered.skills !== "" ? rendered : null;
}

function renderEducationEntry(entry: EducationEntry): Rendered<EducationEntry> | null {
  if (!entry.enabled) return null;
  const rendered = {
    id: entry.id,
    institution: trimmed(entry.institution),
    degree: trimmed(entry.degree),
    location: trimmed(entry.location),
    dates: entry.dates,
    results: trimmed(entry.results),
    bullets: renderBullets(entry.bullets),
  };
  return anyFilled(rendered, [rendered.institution, rendered.degree, rendered.location, rendered.results])
    ? rendered
    : null;
}

function renderCustomEntry(entry: CustomEntry): Rendered<CustomEntry> | null {
  if (!entry.enabled) return null;
  const rendered = {
    id: entry.id,
    title: trimmed(entry.title),
    subtitle: trimmed(entry.subtitle),
    dates: entry.dates,
    bullets: renderBullets(entry.bullets),
  };
  return anyFilled(rendered, [rendered.title, rendered.subtitle]) ? rendered : null;
}

/** An Entry is filled if any of its text fields, its dates or its Bullets are. */
function anyFilled(
  entry: { dates: DateRange; bullets: Rendered<Bullet>[] },
  fields: string[],
): boolean {
  return fields.some((field) => field !== "") || hasDates(entry.dates) || entry.bullets.length > 0;
}

/**
 * An Empty Bullet is left out unless it has renderable children, in which
 * case it renders with empty text and holds them.
 */
function renderBullets(bullets: Bullet[]): Rendered<Bullet>[] {
  return dropNulls(
    bullets.map((bullet) => {
      if (!bullet.enabled) return null;
      const children = renderBullets(bullet.children);
      if (!isFilled(bullet.text) && children.length === 0) return null;
      return { id: bullet.id, text: trimmed(bullet.text), children };
    }),
  );
}

function hasDates({ start, current, end }: DateRange): boolean {
  return start !== null || current || end !== null;
}

function isFilled(text: string): boolean {
  return text.trim() !== "";
}

/**
 * Text as drawn: trimmed, so whitespace-only text becomes "" and a Theme only
 * has to check for "". It is stored as typed; only the view trims it.
 */
function trimmed(text: string): string {
  return text.trim();
}

function dropNulls<T>(items: (T | null)[]): T[] {
  return items.filter((item): item is T => item !== null);
}
