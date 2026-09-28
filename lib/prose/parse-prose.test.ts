import { describe, expect, test } from "vitest";
import { brokenLinks, parseProse, type ProseNode } from "./parse-prose";

const text = (value: string): ProseNode => ({ type: "text", text: value });
const bold = (...children: ProseNode[]): ProseNode => ({ type: "bold", children });
const italic = (...children: ProseNode[]): ProseNode => ({ type: "italic", children });
const link = (href: string, ...children: ProseNode[]): ProseNode => ({ type: "link", href, children });

describe("parseProse", () => {
  test("plain text is one text node, and empty text is none", () => {
    expect(parseProse("Backend engineer.")).toEqual([text("Backend engineer.")]);
    expect(parseProse("")).toEqual([]);
  });

  describe("bold and italic", () => {
    test("**bold** and *italic*", () => {
      expect(parseProse("Cut latency by **40%**, *twice*.")).toEqual([
        text("Cut latency by "),
        bold(text("40%")),
        text(", "),
        italic(text("twice")),
        text("."),
      ]);
    });

    test("nest inside each other", () => {
      expect(parseProse("**a *b* c**")).toEqual([bold(text("a "), italic(text("b")), text(" c"))]);
      expect(parseProse("*a **b** c*")).toEqual([italic(text("a "), bold(text("b")), text(" c"))]);
      expect(parseProse("***both***")).toEqual([bold(italic(text("both")))]);
    });

    test("unmatched asterisks stay as typed", () => {
      expect(parseProse("C* and **half")).toEqual([text("C* and **half")]);
      expect(parseProse("**")).toEqual([text("**")]);
      expect(parseProse("**a*")).toEqual([text("*"), italic(text("a"))]);
    });

    test("asterisks with spaces inside them stay as typed", () => {
      expect(parseProse("5 * 3 * 2")).toEqual([text("5 * 3 * 2")]);
      expect(parseProse("** not bold **")).toEqual([text("** not bold **")]);
    });

    test("underscores are always literal", () => {
      expect(parseProse("_not italic_ and __not bold__ in user_id")).toEqual([
        text("_not italic_ and __not bold__ in user_id"),
      ]);
    });
  });

  describe("links", () => {
    test("http, https and mailto links become links", () => {
      expect(parseProse("See [Ledgerly](https://ledgerly.example.com).")).toEqual([
        text("See "),
        link("https://ledgerly.example.com", text("Ledgerly")),
        text("."),
      ]);
      expect(parseProse("[site](http://maya.example.com)")).toEqual([link("http://maya.example.com", text("site"))]);
      expect(parseProse("[mail me](mailto:maya@example.com)")).toEqual([
        link("mailto:maya@example.com", text("mail me")),
      ]);
    });

    test("a URL can hold balanced brackets", () => {
      expect(parseProse("[Go](https://en.wikipedia.org/wiki/Go_(programming_language)).")).toEqual([
        link("https://en.wikipedia.org/wiki/Go_(programming_language)", text("Go")),
        text("."),
      ]);
    });

    test("a link's label can be bold or italic, and a link can sit inside bold", () => {
      expect(parseProse("[**notes**](https://x.example)")).toEqual([link("https://x.example", bold(text("notes")))]);
      expect(parseProse("**[notes](https://x.example)**")).toEqual([bold(link("https://x.example", text("notes")))]);
    });

    test("a javascript:, data: or scheme-less URL shows the whole source as text", () => {
      expect(parseProse("[click](javascript:alert(1))")).toEqual([text("[click](javascript:alert(1))")]);
      expect(parseProse("[x](data:text/html,hi)")).toEqual([text("[x](data:text/html,hi)")]);
      expect(parseProse("My [GitHub](github.com/maya) page")).toEqual([text("My [GitHub](github.com/maya) page")]);
    });

    test("text that isn't a whole link stays as typed", () => {
      expect(parseProse("[label] (https://x.example)")).toEqual([text("[label] (https://x.example)")]);
      expect(parseProse("[](https://x.example)")).toEqual([text("[](https://x.example)")]);
      expect(parseProse("[open](https://x.example")).toEqual([text("[open](https://x.example")]);
    });
  });

  describe("everything else stays as typed", () => {
    test("headings, code, lists, quotes and other Markdown", () => {
      for (const source of ["# Heading", "`code`", "- item", "1. item", "> quote", "~~struck~~", "---"]) {
        expect(parseProse(source)).toEqual([text(source)]);
      }
    });

    test("an image is not an image: its \"!\" stays and the rest is a link", () => {
      expect(parseProse("![logo](https://x.example/a.png)")).toEqual([
        text("!"),
        link("https://x.example/a.png", text("logo")),
      ]);
    });

    test("raw HTML, script tags included, is text", () => {
      expect(parseProse('<script>alert("x")</script>')).toEqual([text('<script>alert("x")</script>')]);
      expect(parseProse("<b>bold?</b> <img src=x onerror=alert(1)>")).toEqual([
        text("<b>bold?</b> <img src=x onerror=alert(1)>"),
      ]);
    });

    test("an HTML-looking link target is still only allowed as http(s) or mailto", () => {
      expect(parseProse('[x](https://a.example/"><script>)')).toEqual([
        link('https://a.example/"><script>', text("x")),
      ]);
    });
  });

  describe("backslash escapes", () => {
    test("\\*, \\[, \\] and \\\\ show the character itself", () => {
      expect(parseProse("5\\*3\\*2")).toEqual([text("5*3*2")]);
      expect(parseProse("\\*not italic\\*")).toEqual([text("*not italic*")]);
      expect(parseProse("\\[not](https://x.example)")).toEqual([text("[not](https://x.example)")]);
      expect(parseProse("a\\\\b")).toEqual([text("a\\b")]);
    });

    test("an escaped asterisk doesn't close emphasis", () => {
      expect(parseProse("*a\\*b*")).toEqual([italic(text("a*b"))]);
    });

    test("any other backslash stays as typed", () => {
      expect(parseProse("C:\\path\\to _x_")).toEqual([text("C:\\path\\to _x_")]);
    });
  });
});

describe("brokenLinks", () => {
  test("lists each link whose URL can't become a link, as typed", () => {
    expect(brokenLinks("My [GitHub](github.com/maya) and [x](javascript:alert(1)) and [ok](https://a.example)")).toEqual([
      "[GitHub](github.com/maya)",
      "[x](javascript:alert(1))",
    ]);
  });

  test("is empty when every link works, or there are none", () => {
    expect(brokenLinks("[ok](https://a.example) **bold**")).toEqual([]);
    expect(brokenLinks("")).toEqual([]);
  });

  test("finds broken links inside bold and italic", () => {
    expect(brokenLinks("**see [GitHub](github.com/maya)**")).toEqual(["[GitHub](github.com/maya)"]);
  });
});
