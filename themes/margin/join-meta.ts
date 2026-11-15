// Copied from Ledger (themes/ledger/join-meta.ts), so each Theme stays independent.
// The copies may drift apart. When you fix one, check whether the other
// needs the same fix.

/** Joins the filled parts of an Entry's right-hand line: "London · Mar 2022 – Present". */
export function joinMeta(...parts: string[]): string {
  return parts.filter((part) => part).join(" · ");
}
