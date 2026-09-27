import { DEFAULT_THEME_ID } from "@/lib/resume/types";

// Kept apart from the Themes themselves, so pages that only name a Theme
// (like the Library) never load a Theme's code, CSS or font.
const THEME_NAMES: Record<string, string> = {
  [DEFAULT_THEME_ID]: "Ledger",
};

/**
 * The name to show for a Theme id. An unknown id falls back to Ledger's
 * name, as themeFor falls back to Ledger itself.
 */
export function themeName(themeId: string): string {
  return THEME_NAMES[themeId] ?? THEME_NAMES[DEFAULT_THEME_ID];
}
