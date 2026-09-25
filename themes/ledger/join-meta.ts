/** Joins the filled parts of an Entry's right-hand line: "London · Mar 2022 – Present". */
export function joinMeta(...parts: string[]): string {
  return parts.filter((part) => part).join(" · ");
}
