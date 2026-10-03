import { describe, expect, test } from "vitest";
import { dayChoices, draftOf, draftShows, readDraft, withMonth, type DateDraft } from "./date-draft";
import type { ResumeDate } from "./types";

const year = (year: number): ResumeDate => ({ year, month: null, day: null });
const month = (year: number, month: number): ResumeDate => ({ year, month, day: null });
const day = (year: number, month: number, day: number): ResumeDate => ({ year, month, day });

const draft = (year: string, month: number | null = null, day: number | null = null): DateDraft => ({
  year,
  month,
  day,
});

describe("draftOf and readDraft", () => {
  test.each([null, year(2013), month(2022, 3), day(2025, 8, 14)])("a stored date reads back as itself: %j", (date) => {
    expect(readDraft(draftOf(date))).toEqual({ ok: true, date });
  });

  test("no date shows as empty fields", () => {
    expect(draftOf(null)).toEqual(draft(""));
  });
});

describe("readDraft", () => {
  test("empty fields are no date", () => {
    expect(readDraft(draft(""))).toEqual({ ok: true, date: null });
    expect(readDraft(draft("   "))).toEqual({ ok: true, date: null });
  });

  test("a year alone, or with a month, or with a month and a day, is a date", () => {
    expect(readDraft(draft("2013"))).toEqual({ ok: true, date: year(2013) });
    expect(readDraft(draft("2022", 3))).toEqual({ ok: true, date: month(2022, 3) });
    expect(readDraft(draft("2024", 2, 29))).toEqual({ ok: true, date: day(2024, 2, 29) });
  });

  test("spaces around the year are ignored", () => {
    expect(readDraft(draft(" 2013 "))).toEqual({ ok: true, date: year(2013) });
  });

  test("a month or day without a year asks for one", () => {
    expect(readDraft(draft("", 3))).toEqual({ ok: false, field: "year", error: "Add a year." });
    expect(readDraft(draft("", 3, 14))).toEqual({ ok: false, field: "year", error: "Add a year." });
  });

  test.each(["20", "202", "20222", "1899", "2101", "2O22", "-2022", "2022.5"])(
    "the year %j is rejected",
    (typed) => {
      expect(readDraft(draft(typed))).toEqual({
        ok: false,
        field: "year",
        error: "Year must be from 1900 to 2100.",
      });
    },
  );

  test("a day the month doesn't have is rejected, naming the month and year", () => {
    expect(readDraft(draft("2023", 2, 29))).toEqual({
      ok: false,
      field: "day",
      error: "February 2023 has no day 29.",
    });
    expect(readDraft(draft("2025", 4, 31))).toEqual({ ok: false, field: "day", error: "April 2025 has no day 31." });
  });

  test("a day without a month is rejected", () => {
    expect(readDraft(draft("2025", null, 14))).toEqual({
      ok: false,
      field: "day",
      error: "Pick a month for this day.",
    });
  });
});

describe("draftShows", () => {
  test("is true when the fields say exactly this date", () => {
    expect(draftShows(draft("2022", 3), month(2022, 3))).toBe(true);
    expect(draftShows(draft(""), null)).toBe(true);
  });

  test("is false for a different date, or fields that aren't a date", () => {
    expect(draftShows(draft("2022"), month(2022, 3))).toBe(false);
    expect(draftShows(draft("2022", 3), null)).toBe(false);
    expect(draftShows(draft(""), year(2022))).toBe(false);
    expect(draftShows(draft("20"), year(2020))).toBe(false);
  });
});

describe("withMonth", () => {
  test("picks a month and keeps the day, even one the new month doesn't have", () => {
    expect(withMonth(draft("2025", 1, 31), 2)).toEqual(draft("2025", 2, 31));
  });

  test("clearing the month clears the day", () => {
    expect(withMonth(draft("2025", 1, 31), null)).toEqual(draft("2025"));
  });
});

describe("dayChoices", () => {
  test("has no days until a month is picked", () => {
    expect(dayChoices(draft("2025"))).toEqual([]);
  });

  test("lists the days the month has in the typed year", () => {
    expect(dayChoices(draft("2025", 1))).toHaveLength(31);
    expect(dayChoices(draft("2025", 4))).toHaveLength(30);
    expect(dayChoices(draft("2023", 2))).toHaveLength(28);
    expect(dayChoices(draft("2024", 2))).toHaveLength(29);
    expect(dayChoices(draft("2025", 1))[0]).toBe(1);
  });

  test("offers 29 February until there's a valid year", () => {
    expect(dayChoices(draft("", 2))).toHaveLength(29);
    expect(dayChoices(draft("20", 2))).toHaveLength(29);
  });
});
