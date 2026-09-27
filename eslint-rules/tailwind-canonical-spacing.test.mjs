import { RuleTester } from "eslint";
import { describe, it } from "vitest";
import rule from "./tailwind-canonical-spacing.mjs";

// RuleTester reports through the test runner's describe/it.
RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester({
  languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
});

const error = (found, canonical) => ({
  messageId: "useCanonical",
  data: { found, canonical },
});

ruleTester.run("tailwind-canonical-spacing", rule, {
  valid: [
    // Already on the scale.
    `<div className="h-9 gap-0.75 w-23" />`,
    // No scale equivalent: font sizes, radii, fractions of a pixel, calc().
    `<div className="text-[13px] rounded-[3px] h-[2.5px] w-[calc(100%-4px)]" />`,
  ],
  invalid: [
    {
      code: `<div className="h-[34px]" />`,
      errors: [error("h-[34px]", "h-8.5")],
    },
    {
      code: `<div className="flex gap-[3px] min-h-[60px] items-center" />`,
      errors: [error("gap-[3px]", "gap-0.75"), error("min-h-[60px]", "min-h-15")],
    },
    {
      code: "const row = `${cols} w-[1120px] pl-5`;",
      errors: [error("w-[1120px]", "w-280")],
    },
    {
      code: `<div className="hover:mt-[8px] focus-visible:after:inset-[0px] -ml-[4px]" />`,
      errors: [
        error("hover:mt-[8px]", "hover:mt-2"),
        error("focus-visible:after:inset-[0px]", "focus-visible:after:inset-0"),
        error("-ml-[4px]", "-ml-1"),
      ],
    },
    {
      code: `<div className="h-[1px] p-[0.5rem]" />`,
      errors: [error("h-[1px]", "h-px"), error("p-[0.5rem]", "p-2")],
    },
  ],
});
