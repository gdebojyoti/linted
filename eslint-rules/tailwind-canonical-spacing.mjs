// Flags Tailwind classes that use a bracketed pixel or rem value where a class
// on Tailwind's spacing scale gives the same size: "h-[34px]" is "h-8.5".
//
// Tailwind v4's spacing scale has a step for every quarter of --spacing
// (0.25rem, 4px by default), so any whole number of pixels has a scale class.
// This mirrors the "suggest canonical classes" warning of the Tailwind CSS
// IntelliSense editor extension, so it also shows up in `npx eslint`.
//
// It reads every string and template literal, because class names are built
// in both. Only the size utilities below are checked: font sizes, radii and
// shadows have no numeric scale, so e.g. "text-[13px]" is left alone.

/** Utilities whose number means "this many spacing steps". */
const SPACING_UTILITIES = [
  "w", "h", "size", "min-w", "min-h", "max-w", "max-h",
  "gap", "gap-x", "gap-y", "space-x", "space-y",
  "p", "px", "py", "pt", "pr", "pb", "pl", "ps", "pe",
  "m", "mx", "my", "mt", "mr", "mb", "ml", "ms", "me",
  "inset", "inset-x", "inset-y", "top", "right", "bottom", "left", "start", "end",
  "translate-x", "translate-y", "basis", "indent", "scroll-m", "scroll-p",
];

// Longest first, so "min-h" wins over "h" and "gap-x" over "gap".
const UTILITY = [...SPACING_UTILITIES].sort((a, b) => b.length - a.length).join("|");

// variants (e.g. "hover:after:"), optional "!", optional "-", utility, "[34px]".
// A class starts after whitespace, a quote or "}" and ends before whitespace,
// a quote or "${".
const CLASS = new RegExp(
  String.raw`(?<![^\s"'\x60}])((?:[^\s"'\x60:]+:)*)(!?)(-?)(${UTILITY})-\[(\d*\.?\d+)(px|rem)\](?![^\s"'\x60$])`,
  "g",
);

const PX_PER_STEP = 4;

/** The scale step for a size, or null when it isn't a whole quarter step. */
function scaleStep(amount, unit) {
  const px = unit === "rem" ? amount * 16 : amount;
  if (px === 1) return "px";
  const quarterSteps = (px / PX_PER_STEP) * 4;
  if (!Number.isInteger(quarterSteps)) return null;
  return String(quarterSteps / 4);
}

/** @type {import("eslint").Rule.RuleModule} */
const rule = {
  meta: {
    type: "suggestion",
    docs: { description: "Use Tailwind's spacing scale instead of an equal bracketed size" },
    messages: { useCanonical: 'Use "{{canonical}}" instead of "{{found}}".' },
    schema: [],
  },
  create(context) {
    const sourceCode = context.sourceCode;

    function check(node) {
      const text = sourceCode.getText(node);
      for (const match of text.matchAll(CLASS)) {
        const [found, variants, important, negative, utility, amount, unit] = match;
        const step = scaleStep(Number(amount), unit);
        if (step === null) continue;

        const start = node.range[0] + match.index;
        context.report({
          loc: {
            start: sourceCode.getLocFromIndex(start),
            end: sourceCode.getLocFromIndex(start + found.length),
          },
          messageId: "useCanonical",
          data: { found, canonical: `${variants}${important}${negative}${utility}-${step}` },
        });
      }
    }

    return {
      Literal(node) {
        if (typeof node.value === "string") check(node);
      },
      TemplateElement: check,
    };
  },
};

export default rule;
