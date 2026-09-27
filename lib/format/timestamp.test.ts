import { describe, expect, test } from "vitest";
import { formatDay, formatLastEdited } from "./timestamp";

// Local times, so the tests pass in any time zone. Months count from 0.
const now = new Date(2026, 8, 27, 14, 5, 30);
const ago = (date: Date) => formatLastEdited(date.toISOString(), now);

describe("formatLastEdited", () => {
  test("under a minute ago is just now", () => {
    expect(ago(new Date(2026, 8, 27, 14, 5, 0))).toBe("Just now");
  });

  test("a time a little ahead of the clock is just now", () => {
    expect(ago(new Date(2026, 8, 27, 14, 6, 0))).toBe("Just now");
  });

  test("earlier today counts minutes, then hours", () => {
    expect(ago(new Date(2026, 8, 27, 14, 4, 0))).toBe("1 minute ago");
    expect(ago(new Date(2026, 8, 27, 13, 50, 0))).toBe("15 minutes ago");
    expect(ago(new Date(2026, 8, 27, 13, 0, 0))).toBe("1 hour ago");
    expect(ago(new Date(2026, 8, 27, 0, 1, 0))).toBe("14 hours ago");
  });

  test("yesterday shows the time", () => {
    expect(ago(new Date(2026, 8, 26, 18, 40))).toBe("Yesterday, 18:40");
    expect(ago(new Date(2026, 8, 26, 9, 5))).toBe("Yesterday, 09:05");
  });

  test("late yesterday is yesterday, even if under an hour ago", () => {
    const justAfterMidnight = new Date(2026, 8, 27, 0, 10);
    expect(formatLastEdited(new Date(2026, 8, 26, 23, 50).toISOString(), justAfterMidnight)).toBe(
      "Yesterday, 23:50",
    );
  });

  test("two to six days ago counts days", () => {
    expect(ago(new Date(2026, 8, 25, 20, 0))).toBe("2 days ago");
    expect(ago(new Date(2026, 8, 21, 8, 0))).toBe("6 days ago");
  });

  test("a week or more ago shows the date", () => {
    expect(ago(new Date(2026, 8, 20, 8, 0))).toBe("20 Sep 2026");
    expect(ago(new Date(2025, 0, 2, 8, 0))).toBe("2 Jan 2025");
  });
});

describe("formatDay", () => {
  test("shows the day, short month and year", () => {
    expect(formatDay(new Date(2026, 8, 14, 10, 0).toISOString())).toBe("14 Sep 2026");
    expect(formatDay(new Date(2026, 11, 1, 23, 59).toISOString())).toBe("1 Dec 2026");
  });
});
