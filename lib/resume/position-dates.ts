import { hasDates } from "./dates";
import type { DateRange, ResumeDate } from "./types";

// The rules for an Experience Entry's Positions and their dates
// (docs/design/NOTES.md, Positions in an Experience Entry): when they're out
// of date order, how "Sort by date" orders them, and the Entry's overall range.

type Dated = { enabled?: boolean; dates: DateRange };

/**
 * Whether the Positions are out of date order, so "Sort by date" is offered:
 * an Enabled Position sits above another Enabled one with a later start, or
 * one with no start sits above one with a start. Disabled Positions don't
 * count. Starts are compared as sortPositions compares them.
 */
export function positionsOutOfOrder(positions: Dated[]): boolean {
  const enabled = positions.filter((p) => p.enabled !== false);
  return enabled.some((position, i) => i > 0 && startKey(enabled[i - 1].dates.start) < startKey(position.dates.start));
}

/**
 * The Positions sorted for "Sort by date": the latest start at the top, and
 * those with no start at the bottom. Disabled Positions are sorted with the
 * rest. Positions with the same start, or both with none, keep their order.
 * A missing month or day counts as the earliest: "2022" ties with "Jan
 * 2022" and goes below "Mar 2022".
 */
export function sortedPositions<P extends Dated>(positions: P[]): P[] {
  return [...positions].sort((a, b) => startKey(b.dates.start) - startKey(a.dates.start));
}

/** A start as a number to sort by, a missing month or day counting as the first; no start sorts last. */
function startKey(date: ResumeDate | null): number {
  if (!date) return -Infinity;
  return date.year * 10_000 + (date.month ?? 1) * 100 + (date.day ?? 1);
}

/**
 * An Experience Entry's overall range, from these Positions (the caller
 * passes only Enabled ones): the earliest start to the latest end, or to
 * "Present" when any of them is Current. Positions with no dates add
 * nothing. Where two dates tie as far as both go, the vaguer one is used:
 * "2022" and "Mar 2022" start at 2022, and "Jan 2025" and "2025" end at 2025.
 */
export function positionsDateRange(positions: Dated[]): DateRange {
  const dated = positions.map((p) => p.dates).filter(hasDates);
  const start = extreme(dated.flatMap((d) => d.start ?? []), "earliest");
  if (dated.some((d) => d.current)) return { start, current: true, end: null };
  return { start, current: false, end: extreme(dated.flatMap((d) => d.end ?? []), "latest") };
}

/**
 * The earliest or latest of these dates, compared a part at a time: the
 * year, then the month, then the day. Among those that tie so far, one that
 * stops there (no month, or no day) is vaguer, and wins.
 */
function extreme(dates: ResumeDate[], which: "earliest" | "latest"): ResumeDate | null {
  const pick = which === "earliest" ? Math.min : Math.max;
  let left = dates;
  for (const part of ["year", "month", "day"] as const) {
    if (left.length === 0) return null;
    const vague = left.find((d) => d[part] === null);
    if (vague) return vague;
    const best = pick(...left.map((d) => d[part] as number));
    left = left.filter((d) => d[part] === best);
  }
  return left[0] ?? null;
}
