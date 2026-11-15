import type { EditOptions } from "./edit-sections";
import { NO_THEME_OPTIONS_PICKED, type Resume } from "./types";

/**
 * The Resume with this Theme (#107): its Layout and Theme Options reset to the
 * new Theme's defaults (none picked), last edited now. Content never changes.
 * Picking the Theme it already has gives back the Resume itself, so it isn't
 * an edit and nothing is reset.
 */
export function switchTheme(resume: Resume, themeId: string, { now = new Date() }: EditOptions = {}): Resume {
  if (resume.themeSettings.themeId === themeId) return resume;
  return {
    ...resume,
    metadata: { ...resume.metadata, lastEditedAt: now.toISOString() },
    themeSettings: { themeId, layout: null, options: NO_THEME_OPTIONS_PICKED },
  };
}
