import { describe, expect, test } from "vitest";
import { formatLibraryCount } from "./library-count";

describe("formatLibraryCount", () => {
  test("counts every Resume when all are shown", () => {
    expect(formatLibraryCount(5, 5)).toBe("5 resumes");
    expect(formatLibraryCount(1, 1)).toBe("1 resume");
  });

  test("says how many of them a search shows", () => {
    expect(formatLibraryCount(2, 5)).toBe("2 of 5 resumes");
    expect(formatLibraryCount(1, 5)).toBe("1 of 5 resumes");
    expect(formatLibraryCount(0, 5)).toBe("0 of 5 resumes");
  });
});
