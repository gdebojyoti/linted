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
 * Turns a Resume into only the Content a Theme should draw: an item is kept
 * only if it and all its ancestors are Enabled and it is not Empty. Blank
 * fields of kept items come out as "". Section order is the Content's; placing
 * Sections is the Theme's job (ADR 0005).
 */
export function renderableView(resume: Resume): RenderableView {
  return { sections: kept(resume.content.sections.map(renderSection)) };
}

function renderSection(section: Section): RenderedSection | null {
  if (!section.enabled) return null;

  switch (section.type) {
    case "header": {
      const entries = kept(section.entries.map(renderContactEntry));
      const name = clean(section.name);
      const headline = clean(section.headline);
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
  const rendered = kept(entries);
  return rendered.length > 0
    ? { id: section.id, type: section.type, title: section.title, entries: rendered }
    : null;
}

function renderContactEntry(entry: ContactEntry): Rendered<ContactEntry> | null {
  if (!entry.enabled) return null;
  if (entry.kind === "link") {
    const rendered = { id: entry.id, kind: entry.kind, label: clean(entry.label), value: clean(entry.value) };
    return rendered.label !== "" || rendered.value !== "" ? rendered : null;
  }
  return isFilled(entry.value) ? { id: entry.id, kind: entry.kind, value: entry.value } : null;
}

function renderSummaryEntry(entry: SummaryEntry): Rendered<SummaryEntry> | null {
  if (!entry.enabled || !isFilled(entry.text)) return null;
  return { id: entry.id, text: entry.text };
}

function renderExperienceEntry(entry: ExperienceEntry): Rendered<ExperienceEntry> | null {
  if (!entry.enabled) return null;
  const rendered = {
    id: entry.id,
    company: clean(entry.company),
    role: clean(entry.role),
    location: clean(entry.location),
    dates: entry.dates,
    bullets: renderBullets(entry.bullets),
  };
  return anyFilled(rendered, [rendered.company, rendered.role, rendered.location]) ? rendered : null;
}

function renderProjectEntry(entry: ProjectEntry): Rendered<ProjectEntry> | null {
  if (!entry.enabled) return null;
  const rendered = {
    id: entry.id,
    name: clean(entry.name),
    link: clean(entry.link),
    techStack: clean(entry.techStack),
    dates: entry.dates,
    bullets: renderBullets(entry.bullets),
  };
  return anyFilled(rendered, [rendered.name, rendered.link, rendered.techStack]) ? rendered : null;
}

/** Needs at least one Skill: a label on its own has nothing to show. */
function renderSkillsEntry(entry: SkillsEntry): Rendered<SkillsEntry> | null {
  if (!entry.enabled) return null;
  const skills = entry.skills
    .filter((skill) => skill.enabled && isFilled(skill.name))
    .map((skill) => ({ id: skill.id, name: skill.name }));
  if (skills.length === 0) return null;
  return { id: entry.id, label: clean(entry.label), skills };
}

function renderEducationEntry(entry: EducationEntry): Rendered<EducationEntry> | null {
  if (!entry.enabled) return null;
  const rendered = {
    id: entry.id,
    institution: clean(entry.institution),
    degree: clean(entry.degree),
    location: clean(entry.location),
    dates: entry.dates,
    results: clean(entry.results),
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
    title: clean(entry.title),
    subtitle: clean(entry.subtitle),
    dates: entry.dates,
    bullets: renderBullets(entry.bullets),
  };
  return anyFilled(rendered, [rendered.title, rendered.subtitle]) ? rendered : null;
}

/** An Entry is filled if any of its text fields, its dates or its Bullets are. */
function anyFilled(
  entry: { dates: DateRange; bullets: Rendered<Bullet>[] },
  cleanedFields: string[],
): boolean {
  return cleanedFields.some((field) => field !== "") || hasDates(entry.dates) || entry.bullets.length > 0;
}

/**
 * An Empty Bullet is left out unless it has renderable children, in which
 * case it renders blank and holds them.
 */
function renderBullets(bullets: Bullet[]): Rendered<Bullet>[] {
  return kept(
    bullets.map((bullet) => {
      if (!bullet.enabled) return null;
      const children = renderBullets(bullet.children);
      if (!isFilled(bullet.text) && children.length === 0) return null;
      return { id: bullet.id, text: clean(bullet.text), children };
    }),
  );
}

function hasDates({ start, current, end }: DateRange): boolean {
  return start !== null || current || end !== null;
}

function isFilled(text: string): boolean {
  return text.trim() !== "";
}

/** Blank text becomes "", so a Theme only has to check for "". */
function clean(text: string): string {
  return isFilled(text) ? text : "";
}

function kept<T>(items: (T | null)[]): T[] {
  return items.filter((item): item is T => item !== null);
}
