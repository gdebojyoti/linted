import type { AccentId, DensityId, TypefaceId } from "@/lib/resume/types";

/**
 * What each Theme Option's choices are called, and each accent's colour
 * (docs/design/linted-editor-tabs-design/). Every Theme offers the same
 * choices, so the colours live here rather than in a Theme. Every accent
 * passes 4.5:1 on white, so a Theme can use it for text. The Theme tab lists
 * them in the order of ACCENT_IDS, TYPEFACE_IDS and DENSITY_IDS.
 */
export const ACCENTS: Record<AccentId, { label: string; hex: string }> = {
  pine: { label: "Pine", hex: "#17784a" },
  cobalt: { label: "Cobalt", hex: "#2456c7" },
  ink: { label: "Ink", hex: "#1f1f1d" },
  rust: { label: "Rust", hex: "#a8461f" },
  plum: { label: "Plum", hex: "#7a3e8e" },
  teal: { label: "Teal", hex: "#0e6e7a" },
  wine: { label: "Wine", hex: "#9f1239" },
  slate: { label: "Slate", hex: "#475569" },
  ochre: { label: "Ochre", hex: "#8a5a0b" },
};

export const TYPEFACES: Record<TypefaceId, { label: string }> = {
  serif: { label: "Serif" },
  sans: { label: "Sans" },
  classic: { label: "Classic" },
};

export const DENSITIES: Record<DensityId, { label: string }> = {
  comfortable: { label: "Comfortable" },
  compact: { label: "Compact" },
};
