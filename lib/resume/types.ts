// The shape of a stored Resume. Terms follow CONTEXT.md.
// Everything here is JSON-serialisable: timestamps are ISO strings and
// Empty values are "" or null rather than missing keys.

/** Bump when the stored shape changes, and add a migration (ADR 0002). */
export const SCHEMA_VERSION = 1;

export const DEFAULT_RESUME_TITLE = "Untitled Resume";

/** v1 ships exactly one Theme. */
export const DEFAULT_THEME_ID = "ledger";

export type Resume = {
  schemaVersion: typeof SCHEMA_VERSION;
  metadata: Metadata;
  themeSettings: ThemeSettings;
  content: Content;
};

export type Metadata = {
  id: string;
  /** Resume Title: non-empty, need not be unique. */
  title: string;
  /** ISO 8601 timestamp. */
  createdAt: string;
  /** ISO 8601 timestamp. */
  lastEditedAt: string;
};

export type ThemeSettings = {
  themeId: string;
  /** null = the Theme's default Layout. Reset to null when the Theme changes. */
  layout: Layout | null;
};

/** Every Zone a Theme may define. Each Theme uses some of them. */
export const ZONES = ["header", "aside-left", "main", "aside-right", "footer"] as const;

export type Zone = (typeof ZONES)[number];

/**
 * For each Zone, the ids of its Sections in order (ADR 0005). Not a source of
 * truth for Content: unknown ids are ignored, and Sections missing from it go
 * where the Theme's default Layout puts their type.
 */
export type Layout = Partial<Record<Zone, string[]>>;

export type Content = {
  /** Order is the editor's only; placement on the page is the Layout's (ADR 0005). */
  sections: Section[];
};

// Dates

/** A year, optionally narrowed to a month (1-12) and then a day (1-31). */
export type ResumeDate =
  | { year: number; month: null; day: null }
  | { year: number; month: number; day: number | null };

/**
 * Start and end of an Entry. A Current Entry has no end date, so the two
 * can never contradict each other.
 */
export type DateRange = { start: ResumeDate | null } & (
  | { current: true; end: null }
  | { current: false; end: ResumeDate | null }
);

// Items that can be Enabled or Disabled

type Enableable = {
  id: string;
  enabled: boolean;
};

/** A point of Prose. Children are at most two levels deep (enforced by the Resume module). */
export type Bullet = Enableable & {
  /** Prose, stored as Markdown source (ADR 0004). */
  text: string;
  children: Bullet[];
};

export type Skill = Enableable & {
  name: string;
};

// Entries, per Section type

export type ContactKind = "email" | "phone" | "location" | "link";

export type ContactEntry = Enableable &
  (
    | { kind: Exclude<ContactKind, "link">; value: string }
    | { kind: "link"; label: string; value: string }
  );

export type SummaryEntry = Enableable & {
  /** Prose, stored as Markdown source (ADR 0004). */
  text: string;
};

export type ExperienceEntry = Enableable & {
  company: string;
  role: string;
  location: string;
  dates: DateRange;
  bullets: Bullet[];
};

export type ProjectEntry = Enableable & {
  name: string;
  link: string;
  techStack: string;
  dates: DateRange;
  bullets: Bullet[];
};

export type SkillsEntry = Enableable & {
  label: string;
  skills: Skill[];
};

export type EducationEntry = Enableable & {
  institution: string;
  degree: string;
  location: string;
  dates: DateRange;
  /** GPA or results. */
  results: string;
  bullets: Bullet[];
};

export type CustomEntry = Enableable & {
  title: string;
  subtitle: string;
  dates: DateRange;
  bullets: Bullet[];
};

// Sections

type SectionOf<Type extends string, E> = Enableable & {
  type: Type;
  title: string;
  entries: E[];
};

/** Exactly one per Resume, Pinned first in its Zone, with a fixed title. */
export type HeaderSection = SectionOf<"header", ContactEntry> & {
  title: "Header";
  pinned: true;
  name: string;
  headline: string;
};

export type SummarySection = SectionOf<"summary", SummaryEntry>;
export type ExperienceSection = SectionOf<"experience", ExperienceEntry>;
export type ProjectsSection = SectionOf<"projects", ProjectEntry>;
export type SkillsSection = SectionOf<"skills", SkillsEntry>;
export type EducationSection = SectionOf<"education", EducationEntry>;
export type CustomSection = SectionOf<"custom", CustomEntry>;

export type Section =
  | HeaderSection
  | SummarySection
  | ExperienceSection
  | ProjectsSection
  | SkillsSection
  | EducationSection
  | CustomSection;

export type SectionType = Section["type"];
