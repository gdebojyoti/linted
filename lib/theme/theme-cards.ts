import { DEFAULT_THEME_ID, MARGIN_THEME_ID } from "@/lib/resume/types";

/**
 * The Themes the Theme tab offers, in the order of its cards
 * (docs/design/linted-editor-tabs-design/EditorTabTheme): each one's id, a
 * line saying how its page is laid out, and how many columns its mini page
 * diagram draws. Kept apart from the Themes themselves, so the cards never
 * load a Theme's code or fonts.
 */
export const THEME_CARDS: readonly { id: string; description: string; columns: 1 | 2 }[] = [
  { id: DEFAULT_THEME_ID, description: "One column", columns: 1 },
  { id: MARGIN_THEME_ID, description: "Two columns, sidebar on the left", columns: 2 },
];
