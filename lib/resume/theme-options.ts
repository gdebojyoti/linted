import type { EditOptions } from "./edit-sections";
import { ACCENT_IDS, DENSITY_IDS, TYPEFACE_IDS, type Resume, type ThemeOption, type ThemeOptions } from "./types";

/**
 * The Resume with this Theme Option picked (#89), the others and the Layout
 * kept, last edited now. Picking the option already picked gives back the
 * Resume itself, so it isn't an edit.
 */
export function setThemeOption<O extends ThemeOption>(
  resume: Resume,
  option: O,
  value: NonNullable<ThemeOptions[O]>,
  { now = new Date() }: EditOptions = {},
): Resume {
  if (resume.themeSettings.options[option] === value) return resume;
  return {
    ...resume,
    metadata: { ...resume.metadata, lastEditedAt: now.toISOString() },
    themeSettings: {
      ...resume.themeSettings,
      options: { ...resume.themeSettings.options, [option]: value },
    },
  };
}

/** Every Theme Option with a value: what a Theme draws with. A Theme's defaults have this shape too. */
export type ResolvedThemeOptions = { [O in ThemeOption]: NonNullable<ThemeOptions[O]> };

const KNOWN: { [O in ThemeOption]: readonly NonNullable<ThemeOptions[O]>[] } = {
  accent: ACCENT_IDS,
  typeface: TYPEFACE_IDS,
  density: DENSITY_IDS,
};

/**
 * The Theme Options to draw the Resume with: each one picked, or the Theme's
 * default where none is, or where the stored name isn't one the app knows.
 */
export function themeOptionsOf(resume: Resume, defaults: ResolvedThemeOptions): ResolvedThemeOptions {
  const stored = resume.themeSettings.options;
  const pick = <O extends ThemeOption>(option: O): ResolvedThemeOptions[O] => {
    const value = stored?.[option];
    return value !== null && value !== undefined && (KNOWN[option] as readonly unknown[]).includes(value)
      ? (value as ResolvedThemeOptions[O])
      : defaults[option];
  };
  return { accent: pick("accent"), typeface: pick("typeface"), density: pick("density") };
}
