import { describe, expect, test } from "vitest";
import { linkHref } from "./link-href";

describe("linkHref", () => {
  test("keeps http, https and mailto links as they are", () => {
    expect(linkHref("https://github.com/maya")).toBe("https://github.com/maya");
    expect(linkHref("http://maya.example.com")).toBe("http://maya.example.com");
    expect(linkHref("mailto:maya@example.com")).toBe("mailto:maya@example.com");
  });

  test("a link typed without a scheme becomes https", () => {
    expect(linkHref("github.com/maya")).toBe("https://github.com/maya");
    expect(linkHref("  maya.example.com ")).toBe("https://maya.example.com");
  });

  test("any other scheme is not a link, whatever its case or padding", () => {
    expect(linkHref("javascript:alert(1)")).toBeNull();
    expect(linkHref(" JavaScript:alert(1)")).toBeNull();
    expect(linkHref("data:text/html,<script>alert(1)</script>")).toBeNull();
    expect(linkHref("ftp://example.com")).toBeNull();
  });

  test("scheme names are matched case-insensitively", () => {
    expect(linkHref("HTTPS://github.com/maya")).toBe("HTTPS://github.com/maya");
  });

  test("an empty link is not a link", () => {
    expect(linkHref("   ")).toBeNull();
  });
});
