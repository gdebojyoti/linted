import { expect, test } from "vitest";
import { currentLabel } from "./current-label";

test("the Current checkbox's label suits the Section", () => {
  expect(currentLabel("experience")).toBe("I currently work here");
  expect(currentLabel("education")).toBe("I currently study here");
  expect(currentLabel("projects")).toBe("Ongoing");
  expect(currentLabel("custom")).toBe("Ongoing");
});
