import { describe, expect, test } from "vitest";
import { themeFor } from "./theme-for";

describe("themeFor", () => {
  test("loads Ledger", async () => {
    expect((await themeFor("ledger")).id).toBe("ledger");
  });

  test("loads Margin, so the preview and Export draw a Resume whose Theme is Margin", async () => {
    const theme = await themeFor("margin");

    expect(theme.id).toBe("margin");
    expect(theme.zones).toEqual(["header", "aside-left", "main"]);
  });

  test("an unknown Theme id falls back to Ledger", async () => {
    expect((await themeFor("not-a-theme")).id).toBe("ledger");
  });
});
