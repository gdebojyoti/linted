import { editEntry, editPosition, editSections, type EditOptions } from "./edit-sections";
import { emptyPosition } from "./empty-entry";
import type { AddOptions } from "./entries";
import { sortedPositions } from "./position-dates";
import type { ExperienceEntry, Position, Resume } from "./types";

// Position operations: the roles held at an Experience Entry's company. A
// Position's dates and Bullets use the Entry functions, given the Position's
// id (dates.ts, bullets.ts). An Entry always has at least one Position, and
// Positions are never reordered except by sortPositions.

/** The Resume with an Empty, Enabled Position added at the bottom of the Entry's Positions. */
export function addPosition(
  resume: Resume,
  entryId: string,
  { newId = () => crypto.randomUUID(), ...options }: AddOptions = {},
): Resume {
  return editExperienceEntry(
    resume,
    entryId,
    (entry) => ({ ...entry, positions: [...entry.positions, emptyPosition(newId())] }),
    options,
  );
}

/** A Position's plain-text fields. */
export type PositionChanges = Partial<Pick<Position, "role">>;

/** The Resume with a Position's role changed, stored exactly as typed. */
export function updatePosition(
  resume: Resume,
  positionId: string,
  { role }: PositionChanges,
  options: EditOptions = {},
): Resume {
  return editPositions(
    resume,
    positionId,
    (position) => ({ ...position, role: role ?? position.role }),
    options,
  );
}

/** The Resume with the Position Enabled or Disabled. Its Bullets keep their own states. */
export function setPositionEnabled(
  resume: Resume,
  positionId: string,
  enabled: boolean,
  options: EditOptions = {},
): Resume {
  return editPositions(resume, positionId, (position) => ({ ...position, enabled }), options);
}

/**
 * The Resume without the Position. An Entry's last Position can't be
 * deleted: the given Resume comes back unchanged. When only one is left, it's
 * Enabled, since an Entry with one Position shows no checkbox for it.
 */
export function deletePosition(resume: Resume, positionId: string, options: EditOptions = {}): Resume {
  return editSections(
    resume,
    (section) => {
      if (section.type !== "experience") return section;
      const entry = section.entries.find((e) => e.positions.some((p) => p.id === positionId));
      if (!entry || entry.positions.length === 1) return section;
      const positions = entry.positions.filter((p) => p.id !== positionId);
      return editEntry(section, entry.id, (e) => ({
        ...e,
        positions: positions.length === 1 ? [{ ...positions[0], enabled: true }] : positions,
      }));
    },
    options,
  );
}

/**
 * The Resume with the Entry's Positions sorted by date, for "Sort by date"
 * (see sortedPositions). When they're already in that order, the given
 * Resume comes back unchanged.
 */
export function sortPositions(resume: Resume, entryId: string, options: EditOptions = {}): Resume {
  return editSections(
    resume,
    (section) => {
      if (section.type !== "experience") return section;
      const entry = section.entries.find((e) => e.id === entryId);
      if (!entry) return section;
      const positions = sortedPositions(entry.positions);
      if (positions.every((p, i) => p === entry.positions[i])) return section;
      return editEntry(section, entryId, (e) => ({ ...e, positions }));
    },
    options,
  );
}

function editExperienceEntry(
  resume: Resume,
  entryId: string,
  edit: (entry: ExperienceEntry) => ExperienceEntry,
  options: EditOptions,
): Resume {
  return editSections(
    resume,
    (section) => (section.type === "experience" ? editEntry(section, entryId, edit) : section),
    options,
  );
}

function editPositions(
  resume: Resume,
  positionId: string,
  edit: (position: Position) => Position,
  options: EditOptions,
): Resume {
  return editSections(
    resume,
    (section) =>
      section.type === "experience" ? editPosition(section, positionId, edit) : section,
    options,
  );
}
