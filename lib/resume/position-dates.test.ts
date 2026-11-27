import { describe, expect, test } from "vitest";
import { positionsDateRange, positionsOutOfOrder, sortedPositions } from "./position-dates";
import type { DateRange, ResumeDate } from "./types";

const year = (year: number): ResumeDate => ({ year, month: null, day: null });
const month = (year: number, month: number): ResumeDate => ({ year, month, day: null });
const day = (year: number, month: number, day: number): ResumeDate => ({ year, month, day });

const ended = (start: ResumeDate | null, end: ResumeDate | null = null): DateRange => ({ start, current: false, end });
const current = (start: ResumeDate | null): DateRange => ({ start, current: true, end: null });

/** A Position with this name and start, Enabled unless `enabled` is false. */
function starting(id: string, start: ResumeDate | null, enabled = true) {
  return { id, enabled, dates: ended(start) };
}

const ids = (positions: { id: string }[]) => positions.map((p) => p.id);

describe("positionsOutOfOrder", () => {
  test("latest start first is in order", () => {
    expect(positionsOutOfOrder([starting("a", year(2026)), starting("b", year(2025)), starting("c", year(2024))])).toBe(false);
  });

  test("a later start below an earlier one is out of order", () => {
    expect(positionsOutOfOrder([starting("a", year(2026)), starting("b", year(2024)), starting("c", year(2025))])).toBe(true);
  });

  test("the same start, in either order, is in order", () => {
    expect(positionsOutOfOrder([starting("a", year(2024)), starting("b", year(2024))])).toBe(false);
  });

  test("a Position with no start above one with a start is out of order; below it, or with none, is fine", () => {
    expect(positionsOutOfOrder([starting("a", null), starting("b", year(2024))])).toBe(true);
    expect(positionsOutOfOrder([starting("a", year(2024)), starting("b", null)])).toBe(false);
    expect(positionsOutOfOrder([starting("a", null), starting("b", null)])).toBe(false);
  });

  test("Disabled Positions don't count", () => {
    expect(
      positionsOutOfOrder([starting("a", year(2026)), starting("off", year(2030), false), starting("b", year(2025))]),
    ).toBe(false);
    expect(positionsOutOfOrder([starting("off", null, false), starting("a", year(2024))])).toBe(false);
  });

  test("a missing month or day counts as the earliest", () => {
    expect(positionsOutOfOrder([starting("a", year(2022)), starting("b", month(2022, 1))])).toBe(false);
    expect(positionsOutOfOrder([starting("a", year(2022)), starting("b", month(2022, 3))])).toBe(true);
    expect(positionsOutOfOrder([starting("a", month(2022, 3)), starting("b", day(2022, 3, 1))])).toBe(false);
    expect(positionsOutOfOrder([starting("a", month(2022, 3)), starting("b", day(2022, 3, 2))])).toBe(true);
  });

  test("one Position, or none, is in order", () => {
    expect(positionsOutOfOrder([starting("a", null)])).toBe(false);
    expect(positionsOutOfOrder([])).toBe(false);
  });
});

describe("sortedPositions", () => {
  test("puts the latest start at the top", () => {
    const sorted = sortedPositions([starting("26", year(2026)), starting("24", year(2024)), starting("25", year(2025))]);

    expect(ids(sorted)).toEqual(["26", "25", "24"]);
  });

  test("puts Positions with no start at the bottom, keeping their order", () => {
    const sorted = sortedPositions([starting("x", null), starting("a", year(2020)), starting("y", null), starting("b", year(2024))]);

    expect(ids(sorted)).toEqual(["b", "a", "x", "y"]);
  });

  test("keeps Positions with the same start in their order", () => {
    const sorted = sortedPositions([
      starting("first", year(2024)),
      starting("later", year(2025)),
      starting("second", year(2024)),
    ]);

    expect(ids(sorted)).toEqual(["later", "first", "second"]);
  });

  test("sorts Disabled Positions with the rest", () => {
    const sorted = sortedPositions([starting("a", year(2020)), starting("off", year(2024), false)]);

    expect(ids(sorted)).toEqual(["off", "a"]);
  });

  test("a missing month counts as January: 2022 ties with Jan 2022 and goes below Mar 2022", () => {
    const sorted = sortedPositions([
      starting("jan", month(2022, 1)),
      starting("2022", year(2022)),
      starting("mar", month(2022, 3)),
    ]);

    expect(ids(sorted)).toEqual(["mar", "jan", "2022"]);
  });

  test("leaves what it's given alone", () => {
    const positions = [starting("a", year(2020)), starting("b", year(2024))];

    sortedPositions(positions);

    expect(ids(positions)).toEqual(["a", "b"]);
  });
});

describe("positionsDateRange", () => {
  test("runs from the earliest start to the latest end", () => {
    const range = positionsDateRange([
      { dates: ended(month(2025, 2), month(2026, 1)) },
      { dates: ended(month(2022, 3), month(2025, 1)) },
    ]);

    expect(range).toEqual(ended(month(2022, 3), month(2026, 1)));
  });

  test("ends in Present when any Position is Current", () => {
    const range = positionsDateRange([{ dates: current(month(2025, 2)) }, { dates: ended(month(2022, 3), month(2025, 1)) }]);

    expect(range).toEqual(current(month(2022, 3)));
  });

  test("uses the vaguer date where two tie as far as both go", () => {
    expect(positionsDateRange([{ dates: ended(year(2022)) }, { dates: ended(month(2022, 3)) }]).start).toEqual(year(2022));
    expect(positionsDateRange([{ dates: ended(year(2022)) }, { dates: ended(month(2023, 3)) }]).start).toEqual(year(2022));
    expect(positionsDateRange([{ dates: ended(month(2022, 3)) }, { dates: ended(year(2023)) }]).start).toEqual(month(2022, 3));
    expect(positionsDateRange([{ dates: ended(month(2022, 3)) }, { dates: ended(day(2022, 3, 4)) }]).start).toEqual(month(2022, 3));
    expect(positionsDateRange([{ dates: ended(null, month(2025, 1)) }, { dates: ended(null, year(2025)) }]).end).toEqual(year(2025));
    expect(positionsDateRange([{ dates: ended(null, year(2025)) }, { dates: ended(null, month(2024, 3)) }]).end).toEqual(year(2025));
  });

  test("Positions with no dates add nothing, and none at all give no dates", () => {
    expect(positionsDateRange([{ dates: ended(null) }, { dates: ended(year(2020), year(2021)) }])).toEqual(
      ended(year(2020), year(2021)),
    );
    expect(positionsDateRange([{ dates: ended(null) }])).toEqual(ended(null));
    expect(positionsDateRange([])).toEqual(ended(null));
  });

  test("a Position with only an end still sets the end", () => {
    expect(positionsDateRange([{ dates: ended(null, year(2021)) }, { dates: ended(year(2018), year(2019)) }])).toEqual(
      ended(year(2018), year(2021)),
    );
  });
});
