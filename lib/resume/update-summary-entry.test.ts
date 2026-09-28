import { describe, expect, test } from "vitest";
import { addEntry, deleteEntry, setEntryEnabled } from "./entries";
import { renderableView } from "./renderable-view";
import { sampleResume } from "./sample-resume";
import type { Resume, SummaryEntry } from "./types";
import { updateSummaryEntry } from "./update-summary-entry";

const now = new Date("2026-09-29T12:00:00.000Z");

const summaries = (resume: Resume): SummaryEntry[] =>
  resume.content.sections.find((s) => s.type === "summary")!.entries as SummaryEntry[];
const summaryIds = (resume: Resume) => summaries(resume).map((e) => e.id);

describe("updateSummaryEntry", () => {
  test("sets the Prose exactly as typed, Markdown and line breaks included", () => {
    const text = "Backend engineer.\n**8 years** in Go ";
    const updated = updateSummaryEntry(sampleResume, "summary-backend", text, { now });

    expect(summaries(updated)[0]).toEqual({ id: "summary-backend", enabled: true, text });
    expect(summaries(updated)[1]).toEqual(summaries(sampleResume)[1]);
    expect(updated.metadata.lastEditedAt).toBe("2026-09-29T12:00:00.000Z");
  });

  test("an unknown Entry changes nothing", () => {
    expect(updateSummaryEntry(sampleResume, "no-such-entry", "x", { now })).toBe(sampleResume);
  });
});

describe("Summary Entries", () => {
  test("can be added, filled in and deleted", () => {
    let resume = addEntry(sampleResume, "summary", { now, newId: () => "summary-new" });
    resume = updateSummaryEntry(resume, "summary-new", "A third pitch.", { now });
    expect(summaries(resume).at(-1)).toEqual({ id: "summary-new", enabled: true, text: "A third pitch." });

    resume = deleteEntry(resume, "summary", "summary-new", { now });
    expect(summaryIds(resume)).toEqual(["summary-backend", "summary-fullstack"]);
  });

  test("any number can be Enabled at once, and each shows", () => {
    const both = setEntryEnabled(sampleResume, "summary", "summary-fullstack", true, { now });
    const shown = renderableView(both).sections.find((s) => s.type === "summary")!.entries;

    expect(shown.map((e) => e.id)).toEqual(["summary-backend", "summary-fullstack"]);
  });

  test("a Disabled Summary keeps its text but doesn't show", () => {
    const shown = renderableView(sampleResume).sections.find((s) => s.type === "summary")!.entries;

    expect(shown.map((e) => e.id)).toEqual(["summary-backend"]);
    expect(summaries(sampleResume)[1].text).not.toBe("");
  });
});
