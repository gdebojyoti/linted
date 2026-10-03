import { describe, expect, test } from "vitest";
import { bulletLines } from "./bullet-lines";
import type { Bullet } from "./types";

const bullet = (id: string, children: Bullet[] = [], enabled = true): Bullet => ({
  id,
  enabled,
  text: id,
  children,
});

describe("bulletLines", () => {
  test("lists Bullets in reading order, numbered by level", () => {
    const lines = bulletLines([bullet("a", [bullet("a1"), bullet("a2")]), bullet("b"), bullet("c", [bullet("c1")])]);

    expect(lines.map((line) => [line.bullet.id, line.number, line.nested])).toEqual([
      ["a", "1", false],
      ["a1", "1.1", true],
      ["a2", "1.2", true],
      ["b", "2", false],
      ["c", "3", false],
      ["c1", "3.1", true],
    ]);
  });

  test("only a top-level Bullet after the first can be nested", () => {
    const lines = bulletLines([bullet("a", [bullet("a1")]), bullet("b")]);

    expect(lines.map((line) => [line.bullet.id, line.canNest])).toEqual([
      ["a", false],
      ["a1", false],
      ["b", true],
    ]);
  });

  test("says whether each Bullet's parent is Enabled", () => {
    const lines = bulletLines([bullet("a", [bullet("a1")], false), bullet("b", [bullet("b1", [], false)])]);

    expect(lines.map((line) => [line.bullet.id, line.parentEnabled, line.bullet.enabled])).toEqual([
      ["a", true, false],
      ["a1", false, true],
      ["b", true, true],
      ["b1", true, false],
    ]);
  });

  test("no Bullets, no lines", () => {
    expect(bulletLines([])).toEqual([]);
  });
});
