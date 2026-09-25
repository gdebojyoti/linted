import { ledger } from "./ledger/ledger";
import type { Theme } from "./theme";

const THEMES: Theme[] = [ledger];

/**
 * The Theme with this id. An unknown id (only possible with hand-edited or
 * future data) falls back to Ledger; the stored id is left as it is.
 */
export function themeFor(themeId: string): Theme {
  return THEMES.find((theme) => theme.id === themeId) ?? ledger;
}
