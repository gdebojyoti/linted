import { describe, expect, test } from "vitest";
import { sampleResume } from "./sample-resume";
import type { ContactEntry, Resume } from "./types";
import { updateContact } from "./update-contact";

const now = new Date("2026-09-26T12:00:00.000Z");

function contact(resume: Resume, id: string): ContactEntry {
  const header = resume.content.sections.find((s) => s.type === "header");
  const entry = header?.entries.find((e) => e.id === id);
  if (!entry) throw new Error(`expected contact item ${id}`);
  return entry;
}

describe("updateContact", () => {
  test("sets an email, phone or location value exactly as typed", () => {
    const updated = updateContact(sampleResume, "contact-phone", { value: " +44 7700 900999" }, { now });

    expect(contact(updated, "contact-phone")).toEqual({
      id: "contact-phone",
      enabled: false,
      kind: "phone",
      value: " +44 7700 900999",
    });
    expect(updated.metadata.lastEditedAt).toBe("2026-09-26T12:00:00.000Z");
  });

  test("sets a link's label", () => {
    const updated = updateContact(sampleResume, "contact-github", { label: "Code" }, { now });

    expect(contact(updated, "contact-github")).toMatchObject({
      label: "Code",
      value: "https://github.com/example-maya",
    });
  });

  test("only a link has a label", () => {
    const updated = updateContact(sampleResume, "contact-email", { label: "Mail" }, { now });

    expect(contact(updated, "contact-email")).not.toHaveProperty("label");
  });

  describe("the link rule", () => {
    test.each(["https://github.com/maya", "http://maya.example.com", "mailto:maya@example.com", " HTTPS://x.io "])(
      "a link starting with http://, https:// or mailto: is saved as typed: %j",
      (url) => {
        const updated = updateContact(sampleResume, "contact-github", { value: url }, { now });

        expect(contact(updated, "contact-github")).toMatchObject({ value: url });
      },
    );

    test.each(["github.com/maya", "javascript:alert(1)", "ftp://files.example.com", "  "])(
      "any other link is saved as empty: %j",
      (url) => {
        const updated = updateContact(sampleResume, "contact-github", { value: url }, { now });

        expect(contact(updated, "contact-github")).toMatchObject({ label: "GitHub", value: "" });
      },
    );

    test("the rule is only for links", () => {
      const updated = updateContact(sampleResume, "contact-location", { value: "London" }, { now });

      expect(contact(updated, "contact-location")).toMatchObject({ value: "London" });
    });
  });

  test("an unknown contact item changes nothing", () => {
    expect(updateContact(sampleResume, "no-such-item", { value: "x" }, { now })).toBe(sampleResume);
  });
});
