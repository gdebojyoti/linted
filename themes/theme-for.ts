import { DEFAULT_THEME_ID } from "@/lib/resume/types";
import type { Theme } from "./theme";

/**
 * Each Theme is imported only when it's asked for, so its code, CSS and font
 * load in their own chunk and never hold up the rest of the editor.
 */
const THEMES: Record<string, () => Promise<Theme>> = {
  [DEFAULT_THEME_ID]: () => import("./ledger/ledger").then((module) => module.ledger),
};

/**
 * Loads the Theme with this id. An unknown id (only possible with
 * hand-edited or future data) falls back to Ledger; the stored id is left as
 * it is.
 */
export function themeFor(themeId: string): Promise<Theme> {
  return (THEMES[themeId] ?? THEMES[DEFAULT_THEME_ID])();
}
