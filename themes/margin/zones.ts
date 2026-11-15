/** The Zones Margin draws: `header` across the page, then the sidebar (`aside-left`) beside `main`. */
export const MARGIN_ZONES = ["header", "aside-left", "main"] as const;

export type MarginZone = (typeof MARGIN_ZONES)[number];
