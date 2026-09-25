import { describe, expect, test } from "vitest";
import type { DateRange, ResumeDate } from "@/lib/resume/types";
import { formatDateRange } from "./date-range";

const year = (year: number): ResumeDate => ({ year, month: null, day: null });
const month = (year: number, month: number): ResumeDate => ({ year, month, day: null });
const day = (year: number, month: number, day: number): ResumeDate => ({ year, month, day });

const between = (start: ResumeDate | null, end: ResumeDate | null): DateRange => ({ start, current: false, end });
const since = (start: ResumeDate | null): DateRange => ({ start, current: true, end: null });

describe("formatDateRange", () => {
  test("joins a start and an end with an en dash", () => {
    expect(formatDateRange(between(month(2019, 6), month(2022, 2)))).toBe("Jun 2019 – Feb 2022");
  });

  test("a Current range ends in Present", () => {
    expect(formatDateRange(since(month(2022, 3)))).toBe("Mar 2022 – Present");
  });

  test("each date shows only as much as was entered: year, month or day", () => {
    expect(formatDateRange(between(year(2013), year(2017)))).toBe("2013 – 2017");
    expect(formatDateRange(between(day(2025, 8, 14), month(2025, 9)))).toBe("14 Aug 2025 – Sep 2025");
  });

  test("a missing start or end leaves just the date that is there", () => {
    expect(formatDateRange(between(month(2023, 11), null))).toBe("Nov 2023");
    expect(formatDateRange(between(null, year(2019)))).toBe("2019");
    expect(formatDateRange(since(null))).toBe("Present");
  });

  test("no dates at all format as an empty string", () => {
    expect(formatDateRange(between(null, null))).toBe("");
  });

  test("the long style spells months out", () => {
    expect(formatDateRange(between(month(2019, 6), day(2022, 2, 1)), "long")).toBe("June 2019 – 1 February 2022");
    expect(formatDateRange(since(year(2020)), "long")).toBe("2020 – Present");
  });

  test("short is the default style", () => {
    expect(formatDateRange(since(month(2022, 9)), "short")).toBe(formatDateRange(since(month(2022, 9))));
  });
});
