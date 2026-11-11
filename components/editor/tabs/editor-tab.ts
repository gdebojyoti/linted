/** The editor's tabs, in the order the top bar shows them. Content is selected when a Resume opens. */
export const EDITOR_TABS = [
  { value: "content", label: "Content" },
  { value: "layout", label: "Layout" },
  { value: "theme", label: "Theme" },
] as const;

export type EditorTab = (typeof EDITOR_TABS)[number]["value"];

export const FIRST_TAB: EditorTab = EDITOR_TABS[0].value;
