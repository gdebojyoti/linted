import { describe, expect, test } from "vitest";
import { addBullet } from "./bullets";
import { updateDates } from "./dates";
import { addEntry } from "./entries";
import { addPosition, deletePosition, setPositionEnabled, sortPositions, updatePosition } from "./positions";
import { sampleResume } from "./sample-resume";
import type { ExperienceEntry, Position, Resume } from "./types";

const now = new Date("2026-11-28T12:00:00.000Z");

const paystream = "exp-paystream";
const first = "exp-paystream-position-1";

function entryOf(resume: Resume, id: string): ExperienceEntry {
  const experience = resume.content.sections.find((s) => s.type === "experience");
  const entry = experience?.entries.find((e) => e.id === id);
  if (!entry) throw new Error(`expected Experience Entry ${id}`);
  return entry;
}

const positionsOf = (resume: Resume, id = paystream): Position[] => entryOf(resume, id).positions;
const ids = (positions: Position[]) => positions.map((p) => p.id);

/** The sample's Paystream Entry with Positions "a" and "b" added under its first, all three dated. */
function withThree(): Resume {
  let resume = addPosition(sampleResume, paystream, { now, newId: () => "a" });
  resume = addPosition(resume, paystream, { now, newId: () => "b" });
  resume = updateDates(resume, "a", { start: { year: 2020, month: null, day: null } }, { now });
  return updateDates(resume, "b", { start: { year: 2023, month: null, day: null } }, { now });
}

describe("addPosition", () => {
  test("adds an Empty, Enabled Position at the bottom", () => {
    const updated = addPosition(sampleResume, paystream, { now, newId: () => "new" });

    expect(ids(positionsOf(updated))).toEqual([first, "new"]);
    expect(positionsOf(updated)[1]).toEqual({
      id: "new",
      enabled: true,
      role: "",
      dates: { start: null, current: false, end: null },
      bullets: [],
    });
    expect(updated.metadata.lastEditedAt).toBe(now.toISOString());
  });

  test("an unknown Entry, or one of another Section, changes nothing", () => {
    expect(addPosition(sampleResume, "no-such-entry", { now })).toBe(sampleResume);
    expect(addPosition(sampleResume, "proj-ledgerly", { now })).toBe(sampleResume);
  });
});

describe("a new Experience Entry", () => {
  test("starts with one Empty Position, with an id of its own", () => {
    let n = 0;
    const updated = addEntry(sampleResume, "experience", { now, newId: () => `id-${++n}` });

    expect(entryOf(updated, "id-1")).toEqual({
      id: "id-1",
      enabled: true,
      company: "",
      location: "",
      positions: [{ id: "id-2", enabled: true, role: "", dates: { start: null, current: false, end: null }, bullets: [] }],
    });
  });
});

describe("updatePosition", () => {
  test("sets the role exactly as typed, leaving the rest", () => {
    const updated = updatePosition(sampleResume, first, { role: " Staff Engineer" }, { now });

    expect(positionsOf(updated)[0]).toEqual({ ...positionsOf(sampleResume)[0], role: " Staff Engineer" });
    expect(entryOf(updated, "exp-northwind")).toEqual(entryOf(sampleResume, "exp-northwind"));
  });

  test("an unknown Position changes nothing", () => {
    expect(updatePosition(sampleResume, "no-such-position", { role: "x" }, { now })).toBe(sampleResume);
    expect(updatePosition(sampleResume, paystream, { role: "x" }, { now })).toBe(sampleResume);
  });
});

describe("a Position's dates and Bullets", () => {
  test("are set with the Entry functions, given the Position's id", () => {
    let updated = updateDates(sampleResume, first, { start: { year: 2021, month: null, day: null } }, { now });
    updated = addBullet(updated, first, { now, newId: () => "new" });

    expect(positionsOf(updated)[0].dates.start).toEqual({ year: 2021, month: null, day: null });
    expect(positionsOf(updated)[0].bullets.at(-1)?.id).toBe("new");
  });

  test("an Experience Entry's own id holds neither", () => {
    expect(updateDates(sampleResume, paystream, { start: { year: 2021, month: null, day: null } }, { now })).toBe(
      sampleResume,
    );
    expect(addBullet(sampleResume, paystream, { now })).toBe(sampleResume);
  });
});

describe("setPositionEnabled", () => {
  test("Disables and Enables a Position, leaving its Bullets' own states", () => {
    const disabled = setPositionEnabled(sampleResume, first, false, { now });

    expect(positionsOf(disabled)[0]).toEqual({ ...positionsOf(sampleResume)[0], enabled: false });
    expect(positionsOf(setPositionEnabled(disabled, first, true, { now }))).toEqual(positionsOf(sampleResume));
  });
});

describe("deletePosition", () => {
  test("deletes the Position, the others keeping their order", () => {
    const updated = deletePosition(withThree(), "a", { now });

    expect(ids(positionsOf(updated))).toEqual([first, "b"]);
  });

  test("an Entry's last Position can't be deleted", () => {
    expect(deletePosition(sampleResume, first, { now })).toBe(sampleResume);
  });

  test("the one Position left is Enabled, since the single-Position form has no checkbox for it", () => {
    let resume = addPosition(sampleResume, paystream, { now, newId: () => "a" });
    resume = setPositionEnabled(resume, "a", false, { now });

    const updated = deletePosition(resume, first, { now });

    expect(positionsOf(updated)).toEqual([{ ...positionsOf(resume)[1], enabled: true }]);
  });

  test("an unknown Position changes nothing", () => {
    expect(deletePosition(sampleResume, "no-such-position", { now })).toBe(sampleResume);
  });
});

describe("sortPositions", () => {
  test("sorts by start, latest at the top", () => {
    // Paystream's first Position starts Mar 2022; "a" 2020, "b" 2023.
    const updated = sortPositions(withThree(), paystream, { now });

    expect(ids(positionsOf(updated))).toEqual(["b", first, "a"]);
  });

  test("Positions already in order change nothing", () => {
    const sorted = sortPositions(withThree(), paystream, { now });

    expect(sortPositions(sorted, paystream, { now })).toBe(sorted);
  });

  test("an unknown Entry changes nothing", () => {
    expect(sortPositions(sampleResume, "no-such-entry", { now })).toBe(sampleResume);
  });
});
