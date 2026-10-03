import type { SectionType } from "./types";

/** The label of an Entry's Current checkbox, by the type of its Section (#1). */
export function currentLabel(type: SectionType): string {
  switch (type) {
    case "experience":
      return "I currently work here";
    case "education":
      return "I currently study here";
    default:
      return "Ongoing";
  }
}
