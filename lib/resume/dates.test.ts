import { describe, expect, test } from "vitest";
import { isValidDate, setCurrent, updateDates, type DateParts } from "./dates";
import { sampleResume } from "./sample-resume";
import type { DateRange, Resume, ResumeDate } from "./types";

const now = new Date("2026-09-29T12:00:00.000Z");

const year = (year: number): ResumeDate => ({ year, month: null, day: null });
const month = (year: number, month: number): ResumeDate => ({ year, month, day: null });
const day = (year: number, month: number, day: number): ResumeDate => ({ year, month, day });

function datesOf(resume: Resume, entryId: string): DateRange {
  for (const section of resume.content.sections) {
    const entry = section.entries.find((e) => e.id === entryId);
    if (entry && "dates" in entry) return entry.dates;
  }
  throw new Error(`expected an Entry with dates: ${entryId}`);
}

describe("isValidDate", () => {
  test.each([
    year(1900),
    year(2100),
    month(2022, 1),
    month(2022, 12),
    day(2025, 1, 31),
    day(2025, 4, 30),
    day(2024, 2, 29),
    day(2000, 2, 29),
  ])("accepts %j", (date) => {
    expect(isValidDate(date)).toBe(true);
  });

  test.each<[string, DateParts]>([
    ["a year before 1900", { year: 1899, month: null, day: null }],
    ["a year after 2100", { year: 2101, month: null, day: null }],
    ["a year that isn't a whole number", { year: 2020.5, month: null, day: null }],
    ["a year that isn't a number", { year: Number.NaN, month: null, day: null }],
    ["month 0", { year: 2020, month: 0, day: null }],
    ["month 13", { year: 2020, month: 13, day: null }],
    ["a month that isn't a whole number", { year: 2020, month: 1.5, day: null }],
    ["a day without a month", { year: 2020, month: null, day: 5 }],
    ["day 0", { year: 2020, month: 1, day: 0 }],
    ["day 32", { year: 2020, month: 1, day: 32 }],
    ["31 April", { year: 2025, month: 4, day: 31 }],
    ["29 February outside a leap year", { year: 2023, month: 2, day: 29 }],
    ["29 February 1900, a century that isn't a leap year", { year: 1900, month: 2, day: 29 }],
    ["a day that isn't a whole number", { year: 2020, month: 1, day: 1.5 }],
  ])("rejects %s", (_, parts) => {
    expect(isValidDate(parts)).toBe(false);
  });
});

describe("updateDates", () => {
  test("sets the start and end dates", () => {
    const updated = updateDates(sampleResume, "exp-northwind", { start: month(2019, 9), end: day(2022, 2, 28) }, { now });

    expect(datesOf(updated, "exp-northwind")).toEqual({ start: month(2019, 9), current: false, end: day(2022, 2, 28) });
    expect(datesOf(updated, "exp-first-job")).toEqual(datesOf(sampleResume, "exp-first-job"));
    expect(updated.metadata.lastEditedAt).toBe(now.toISOString());
  });

  test("a date left out stays as it is", () => {
    const updated = updateDates(sampleResume, "exp-northwind", { end: year(2023) }, { now });

    expect(datesOf(updated, "exp-northwind")).toEqual({ start: month(2019, 6), current: false, end: year(2023) });
  });

  test("null clears a date, so an Entry can have no dates at all", () => {
    const updated = updateDates(sampleResume, "exp-northwind", { start: null, end: null }, { now });

    expect(datesOf(updated, "exp-northwind")).toEqual({ start: null, current: false, end: null });
  });

  test.each(["exp-northwind", "proj-rate-limiter", "edu-manchester", "talk-meetup"])(
    "sets the dates of Experience, Projects, Education and Custom Entries: %s",
    (entryId) => {
      const updated = updateDates(sampleResume, entryId, { start: year(2021) }, { now });

      expect(datesOf(updated, entryId).start).toEqual(year(2021));
    },
  );

  test("an end date before the start date is allowed", () => {
    const updated = updateDates(sampleResume, "exp-northwind", { start: year(2022), end: year(2020) }, { now });

    expect(datesOf(updated, "exp-northwind")).toEqual({ start: year(2022), current: false, end: year(2020) });
  });

  test("an invalid date rejects the whole change", () => {
    expect(updateDates(sampleResume, "exp-northwind", { start: year(1850) }, { now })).toBe(sampleResume);
    expect(
      updateDates(sampleResume, "exp-northwind", { start: month(2019, 7), end: month(2022, 13) }, { now }),
    ).toBe(sampleResume);
  });

  test("a Current Entry can't be given an end date", () => {
    expect(updateDates(sampleResume, "exp-paystream", { end: month(2024, 1) }, { now })).toBe(sampleResume);
    expect(
      updateDates(sampleResume, "exp-paystream", { start: month(2021, 1), end: month(2024, 1) }, { now }),
    ).toBe(sampleResume);
  });

  test("a Current Entry's start date can still change", () => {
    const updated = updateDates(sampleResume, "exp-paystream", { start: month(2021, 11), end: null }, { now });

    expect(datesOf(updated, "exp-paystream")).toEqual({ start: month(2021, 11), current: true, end: null });
  });

  test.each(["no-such-entry", "summary-backend", "skills-languages", "contact-email"])(
    "an unknown Entry, or one without dates, changes nothing: %s",
    (entryId) => {
      expect(updateDates(sampleResume, entryId, { start: year(2021) }, { now })).toBe(sampleResume);
    },
  );

  test("the given Resume is not changed", () => {
    const before = structuredClone(sampleResume);

    updateDates(sampleResume, "exp-northwind", { start: null, end: year(2023) }, { now });

    expect(sampleResume).toEqual(before);
  });
});

describe("setCurrent", () => {
  test("marking an Entry Current removes its end date", () => {
    const updated = setCurrent(sampleResume, "exp-northwind", true, { now });

    expect(datesOf(updated, "exp-northwind")).toEqual({ start: month(2019, 6), current: true, end: null });
    expect(updated.metadata.lastEditedAt).toBe(now.toISOString());
  });

  test("unmarking it doesn't bring the end date back", () => {
    const updated = setCurrent(setCurrent(sampleResume, "exp-northwind", true, { now }), "exp-northwind", false, { now });

    expect(datesOf(updated, "exp-northwind")).toEqual({ start: month(2019, 6), current: false, end: null });
  });

  test("an Entry that is no longer Current can be given an end date", () => {
    const updated = updateDates(setCurrent(sampleResume, "exp-paystream", false, { now }), "exp-paystream", {
      end: month(2025, 6),
    });

    expect(datesOf(updated, "exp-paystream")).toEqual({ start: month(2022, 3), current: false, end: month(2025, 6) });
  });

  test("an Entry with no start date can be Current", () => {
    const updated = setCurrent(sampleResume, "proj-rate-limiter", true, { now });

    expect(datesOf(updated, "proj-rate-limiter")).toEqual({ start: null, current: true, end: null });
  });

  test.each(["no-such-entry", "summary-backend", "skills-languages", "contact-email"])(
    "an unknown Entry, or one without dates, changes nothing: %s",
    (entryId) => {
      expect(setCurrent(sampleResume, entryId, true, { now })).toBe(sampleResume);
    },
  );

  test("the given Resume is not changed", () => {
    const before = structuredClone(sampleResume);

    setCurrent(sampleResume, "exp-northwind", true, { now });

    expect(sampleResume).toEqual(before);
  });
});
