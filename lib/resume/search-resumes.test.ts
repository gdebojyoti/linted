import { describe, expect, test } from "vitest";
import { newResume } from "./new-resume";
import { searchResumes } from "./search-resumes";

let id = 0;
const resume = (title: string) => newResume({ title, newId: () => `r${++id}` });

const stripe = resume("Stripe backend v2");
const design = resume("Product design");
const stripeFrontend = resume("Stripe frontend");
const library = [stripe, design, stripeFrontend];

const titles = (query: string) => searchResumes(library, query).map((r) => r.metadata.title);

describe("searchResumes", () => {
  test("keeps the Resumes whose Resume Title contains the search, in the Library's order", () => {
    expect(titles("Stripe")).toEqual(["Stripe backend v2", "Stripe frontend"]);
  });

  test("ignores case", () => {
    expect(titles("sTRIPE BACK")).toEqual(["Stripe backend v2"]);
  });

  test("ignores spaces at the ends of the search", () => {
    expect(titles("  design ")).toEqual(["Product design"]);
  });

  test("an empty search, or only spaces, keeps every Resume", () => {
    expect(searchResumes(library, "")).toEqual(library);
    expect(searchResumes(library, "   ")).toEqual(library);
  });

  test("keeps nothing when no Resume Title matches", () => {
    expect(titles("Google")).toEqual([]);
  });
});
