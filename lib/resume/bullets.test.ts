import { describe, expect, test } from "vitest";
import {
  addBullet,
  addBulletAfter,
  deleteBullet,
  nestBullet,
  setBulletEnabled,
  unnestBullet,
  updateBullet,
} from "./bullets";
import { renderableView } from "./renderable-view";
import { sampleResume } from "./sample-resume";
import type { Bullet, Resume } from "./types";

const now = new Date("2026-09-29T12:00:00.000Z");

const paystream = "exp-paystream";

function bulletsOf(resume: Resume, entryId: string): Bullet[] {
  for (const section of resume.content.sections) {
    const entry = section.entries.find((e) => e.id === entryId);
    if (entry && "bullets" in entry) return entry.bullets;
  }
  throw new Error(`expected an Entry with Bullets: ${entryId}`);
}

/**
 * The Entry's Bullet ids in reading order, indented two spaces per level, and
 * shortened by dropping the Entry's id: ["b1", "  b1-1", "b2"].
 */
function outline(resume: Resume, entryId: string): string[] {
  const walk = (bullets: Bullet[], indent: string): string[] =>
    bullets.flatMap((b) => [indent + b.id.replace(`${entryId}-`, ""), ...walk(b.children, `${indent}  `)]);
  return walk(bulletsOf(resume, entryId), "");
}

test("the sample Entry these tests use", () => {
  expect(outline(sampleResume, paystream)).toEqual(["b1", "  b1-1", "  b1-2", "b2", "b3"]);
});

describe("addBullet", () => {
  test("adds an Empty, Enabled Bullet at the end of the Entry's top level", () => {
    const updated = addBullet(sampleResume, paystream, { now, newId: () => "new" });

    expect(outline(updated, paystream)).toEqual(["b1", "  b1-1", "  b1-2", "b2", "b3", "new"]);
    expect(bulletsOf(updated, paystream).at(-1)).toEqual({ id: "new", enabled: true, text: "", children: [] });
    expect(updated.metadata.lastEditedAt).toBe(now.toISOString());
  });

  test("an Empty Bullet isn't drawn", () => {
    const updated = addBullet(sampleResume, paystream, { now, newId: () => "new" });

    expect(renderableView(updated)).toEqual(renderableView(sampleResume));
  });

  test.each(["exp-northwind", "proj-ledgerly", "edu-manchester", "talk-meetup"])(
    "adds to Experience, Projects, Education and Custom Entries: %s",
    (entryId) => {
      const updated = addBullet(sampleResume, entryId, { now, newId: () => "new" });

      expect(outline(updated, entryId)).toEqual([...outline(sampleResume, entryId), "new"]);
    },
  );

  test.each(["no-such-entry", "summary-backend", "skills-languages", "contact-email"])(
    "an unknown Entry, or one without Bullets, changes nothing: %s",
    (entryId) => {
      expect(addBullet(sampleResume, entryId, { now, newId: () => "new" })).toBe(sampleResume);
    },
  );
});

describe("addBulletAfter", () => {
  test("adds an Empty, Enabled Bullet right after a top-level Bullet", () => {
    const updated = addBulletAfter(sampleResume, "exp-paystream-b2", { now, newId: () => "new" });

    expect(outline(updated, paystream)).toEqual(["b1", "  b1-1", "  b1-2", "b2", "new", "b3"]);
    expect(bulletsOf(updated, paystream)[2]).toEqual({ id: "new", enabled: true, text: "", children: [] });
    expect(updated.metadata.lastEditedAt).toBe(now.toISOString());
  });

  test("after the last Bullet, adds at the end", () => {
    const updated = addBulletAfter(sampleResume, "exp-paystream-b3", { now, newId: () => "new" });

    expect(outline(updated, paystream)).toEqual(["b1", "  b1-1", "  b1-2", "b2", "b3", "new"]);
  });

  test("after a child Bullet, adds a child of the same parent", () => {
    const afterFirst = addBulletAfter(sampleResume, "exp-paystream-b1-1", { now, newId: () => "new" });
    const afterLast = addBulletAfter(sampleResume, "exp-paystream-b1-2", { now, newId: () => "new" });

    expect(outline(afterFirst, paystream)).toEqual(["b1", "  b1-1", "  new", "  b1-2", "b2", "b3"]);
    expect(outline(afterLast, paystream)).toEqual(["b1", "  b1-1", "  b1-2", "  new", "b2", "b3"]);
  });

  test("after a top-level Bullet with children, the new Bullet takes them, keeping their own states", () => {
    const [b1] = bulletsOf(sampleResume, paystream);

    const updated = addBulletAfter(sampleResume, "exp-paystream-b1", { now, newId: () => "new" });

    expect(outline(updated, paystream)).toEqual(["b1", "new", "  b1-1", "  b1-2", "b2", "b3"]);
    expect(bulletsOf(updated, paystream)[1].children).toEqual(b1.children);
  });

  test("the new Bullet is Enabled even after a Disabled one, so the children it takes show again", () => {
    const disabled = setBulletEnabled(sampleResume, "exp-paystream-b1", false, { now });

    const updated = addBulletAfter(disabled, "exp-paystream-b1", { now, newId: () => "new" });

    expect(bulletsOf(updated, paystream)[1].enabled).toBe(true);
    const entry = renderableView(updated)
      .sections.flatMap((s) => s.entries)
      .find((e) => e.id === paystream);
    const drawn = entry && "bullets" in entry ? entry.bullets.find((b) => b.id === "new") : undefined;
    expect(drawn?.children.map((c) => c.id)).toEqual(["exp-paystream-b1-1"]);
  });

  test("an unknown Bullet changes nothing", () => {
    expect(addBulletAfter(sampleResume, "no-such-bullet", { now, newId: () => "new" })).toBe(sampleResume);
  });
});

describe("updateBullet", () => {
  test("sets a top-level or child Bullet's Prose exactly as typed", () => {
    let updated = updateBullet(sampleResume, "exp-paystream-b2", "Cut **duplicate charges** ", { now });
    updated = updateBullet(updated, "exp-paystream-b1-1", "Shadow traffic first.", { now });

    const [b1, b2] = bulletsOf(updated, paystream);
    expect(b2.text).toBe("Cut **duplicate charges** ");
    expect(b1.children[0].text).toBe("Shadow traffic first.");
    expect(outline(updated, paystream)).toEqual(outline(sampleResume, paystream));
    expect(updated.metadata.lastEditedAt).toBe(now.toISOString());
  });

  test("an unknown Bullet changes nothing", () => {
    expect(updateBullet(sampleResume, "no-such-bullet", "x", { now })).toBe(sampleResume);
  });
});

describe("deleteBullet", () => {
  test("deletes a top-level Bullet together with its children", () => {
    const updated = deleteBullet(sampleResume, "exp-paystream-b1", { now });

    expect(outline(updated, paystream)).toEqual(["b2", "b3"]);
    expect(updated.metadata.lastEditedAt).toBe(now.toISOString());
  });

  test("deletes a child Bullet on its own", () => {
    const updated = deleteBullet(sampleResume, "exp-paystream-b1-1", { now });

    expect(outline(updated, paystream)).toEqual(["b1", "  b1-2", "b2", "b3"]);
  });

  test("an unknown Bullet changes nothing", () => {
    expect(deleteBullet(sampleResume, "no-such-bullet", { now })).toBe(sampleResume);
  });
});

describe("setBulletEnabled", () => {
  test("Disabling a Bullet leaves its children's own states", () => {
    const disabled = setBulletEnabled(sampleResume, "exp-paystream-b1", false, { now });

    const [b1] = bulletsOf(disabled, paystream);
    expect(b1.enabled).toBe(false);
    expect(b1.children.map((c) => c.enabled)).toEqual([true, false]);
    expect(disabled.metadata.lastEditedAt).toBe(now.toISOString());
  });

  test("re-Enabling a parent brings back its children as they were", () => {
    const disabled = setBulletEnabled(sampleResume, "exp-paystream-b1", false, { now });
    const enabled = setBulletEnabled(disabled, "exp-paystream-b1", true, { now });

    expect(bulletsOf(enabled, paystream)).toEqual(bulletsOf(sampleResume, paystream));
  });

  test("Enables a Disabled child Bullet", () => {
    const updated = setBulletEnabled(sampleResume, "exp-paystream-b1-2", true, { now });

    expect(bulletsOf(updated, paystream)[0].children.map((c) => c.enabled)).toEqual([true, true]);
  });

  test("an unknown Bullet changes nothing", () => {
    expect(setBulletEnabled(sampleResume, "no-such-bullet", false, { now })).toBe(sampleResume);
  });
});

describe("nestBullet", () => {
  test("nests a Bullet under the one above it, as its last child", () => {
    const updated = nestBullet(sampleResume, "exp-paystream-b2", { now });

    expect(outline(updated, paystream)).toEqual(["b1", "  b1-1", "  b1-2", "  b2", "b3"]);
    expect(updated.metadata.lastEditedAt).toBe(now.toISOString());
  });

  test("a Bullet's own children come along, so nothing goes deeper and the reading order stays the same", () => {
    const unnested = unnestBullet(sampleResume, "exp-paystream-b1-1", { now });
    expect(outline(unnested, paystream)).toEqual(["b1", "b1-1", "  b1-2", "b2", "b3"]);

    const nested = nestBullet(unnested, "exp-paystream-b1-1", { now });

    expect(outline(nested, paystream)).toEqual(["b1", "  b1-1", "  b1-2", "b2", "b3"]);
  });

  test("keeps the Bullet's text and Enabled state", () => {
    const [, disabledBullet] = bulletsOf(sampleResume, "exp-northwind");

    const updated = nestBullet(sampleResume, disabledBullet.id, { now });

    expect(bulletsOf(updated, "exp-northwind")[0].children).toEqual([disabledBullet]);
  });

  test("the first Bullet can't be nested, as there's nothing above it", () => {
    expect(nestBullet(sampleResume, "exp-paystream-b1", { now })).toBe(sampleResume);
  });

  test("a child Bullet can't be nested any deeper", () => {
    expect(nestBullet(sampleResume, "exp-paystream-b1-1", { now })).toBe(sampleResume);
  });

  test("an unknown Bullet changes nothing", () => {
    expect(nestBullet(sampleResume, "no-such-bullet", { now })).toBe(sampleResume);
  });
});

describe("unnestBullet", () => {
  test("moves a child Bullet out, right after its parent, and the children after it follow it", () => {
    const updated = unnestBullet(sampleResume, "exp-paystream-b1-1", { now });

    expect(outline(updated, paystream)).toEqual(["b1", "b1-1", "  b1-2", "b2", "b3"]);
    expect(updated.metadata.lastEditedAt).toBe(now.toISOString());
  });

  test("un-nesting the last child leaves the others with their parent", () => {
    const updated = unnestBullet(sampleResume, "exp-paystream-b1-2", { now });

    expect(outline(updated, paystream)).toEqual(["b1", "  b1-1", "b1-2", "b2", "b3"]);
  });

  test("keeps the Bullet's text and Enabled state", () => {
    const disabledChild = bulletsOf(sampleResume, paystream)[0].children[1];

    const updated = unnestBullet(sampleResume, disabledChild.id, { now });

    expect(bulletsOf(updated, paystream)[1]).toEqual(disabledChild);
  });

  test("a top-level Bullet can't be un-nested", () => {
    expect(unnestBullet(sampleResume, "exp-paystream-b2", { now })).toBe(sampleResume);
  });

  test("an unknown Bullet changes nothing", () => {
    expect(unnestBullet(sampleResume, "no-such-bullet", { now })).toBe(sampleResume);
  });
});

test("Bullet edits don't change the given Resume", () => {
  const before = structuredClone(sampleResume);

  addBullet(sampleResume, paystream, { now, newId: () => "new" });
  addBulletAfter(sampleResume, "exp-paystream-b1", { now, newId: () => "new" });
  updateBullet(sampleResume, "exp-paystream-b1-1", "x", { now });
  deleteBullet(sampleResume, "exp-paystream-b1", { now });
  setBulletEnabled(sampleResume, "exp-paystream-b1", false, { now });
  nestBullet(sampleResume, "exp-paystream-b2", { now });
  unnestBullet(sampleResume, "exp-paystream-b1-1", { now });

  expect(sampleResume).toEqual(before);
});
