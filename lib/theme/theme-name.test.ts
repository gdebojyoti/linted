import { describe, expect, test } from "vitest";
import { themeName } from "./theme-name";

describe("themeName", () => {
  test("names Ledger", () => {
    expect(themeName("ledger")).toBe("Ledger");
  });

  test("an unknown Theme id falls back to Ledger's name", () => {
    expect(themeName("not-a-theme")).toBe("Ledger");
  });
});
