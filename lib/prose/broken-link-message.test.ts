import { expect, test } from "vitest";
import { brokenLinkMessage } from "./broken-link-message";

test("names the link as typed and says how to fix it", () => {
  expect(brokenLinkMessage("[GitHub](github.com/maya)")).toBe(
    "[GitHub](github.com/maya) isn't a link: its address must start with https://, http:// or mailto:.",
  );
});
