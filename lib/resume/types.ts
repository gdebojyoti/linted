// The shape of a stored Resume. Terms follow CONTEXT.md.
// Everything here is JSON-serialisable: timestamps are ISO strings and
// Empty values are "" or null rather than missing keys.

/** Bump when the stored shape changes, and add a migration (ADR 0002). */
export const SCHEMA_VERSION = 1;

export const DEFAULT_RESUME_TITLE = "Untitled Resume";

/** v1 ships exactly one Theme. */
export const DEFAULT_THEME_ID = "classic";

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
};

export type Content = {
  /** Stored order is kept even though v1 Themes decide placement (ADR 0003). */
  sections: Section[];
};

// Dates

/** A year, optionally narrowed to a month (1-12) and then a day (1-31). */
export type ResumeDate = {
  year: number;
  month: number | null;
  day: number | null;
};

/**
 * Start and end of an Entry. A Current Entry has no end date, so the two
 * can never contradict each other.
 */
export type DateRange = { start: ResumeDate | null } & (
  | { current: true; end: null }
  | { current: false; end: ResumeDate | null }
);

// Items that can be Enabled or Disabled

type Toggleable = {
  id: string;
  enabled: boolean;
};

/** A point of Prose. Children are at most two levels deep (enforced by the Resume module). */
export type Bullet = Toggleable & {
  /** Prose, stored as Markdown source (ADR 0004). */
  text: string;
  children: Bullet[];
};

export type Skill = Toggleable & {
  name: string;
};

// Entries, per Section type

export type ContactKind = "email" | "phone" | "location" | "link";

export type ContactEntry = Toggleable &
  (
    | { kind: Exclude<ContactKind, "link">; value: string }
    | { kind: "link"; label: string; value: string }
  );

export type SummaryEntry = Toggleable & {
  /** Prose, stored as Markdown source (ADR 0004). */
  text: string;
};

export type ExperienceEntry = Toggleable & {
  company: string;
  role: string;
  location: string;
  dates: DateRange;
  bullets: Bullet[];
};

export type ProjectEntry = Toggleable & {
  name: string;
  link: string;
  techStack: string;
  dates: DateRange;
  bullets: Bullet[];
};

export type SkillsEntry = Toggleable & {
  label: string;
  skills: Skill[];
};

export type EducationEntry = Toggleable & {
  institution: string;
  degree: string;
  location: string;
  dates: DateRange;
  /** GPA or results. */
  results: string;
  bullets: Bullet[];
};

export type CustomEntry = Toggleable & {
  title: string;
  subtitle: string;
  dates: DateRange;
  bullets: Bullet[];
};

// Sections

type SectionOf<Type extends string, E> = Toggleable & {
  type: Type;
  title: string;
  entries: E[];
};

/** At most one per Resume, Pinned first, with a fixed title. */
export type HeaderSection = SectionOf<"header", ContactEntry> & {
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
