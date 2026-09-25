import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Import style: "./" for files in the same folder or below it, "@/" for
// everything else. Climbing up with "../" is never allowed.
//
// ESLint lets a later config block replace a rule's options rather than add
// to them, so every block below that sets no-restricted-imports includes
// this pattern again.
const noParentImports = {
  regex: "(^|/)\\.\\.(/|$)",
  message: 'Use "@/..." instead of "../". Relative imports are only for the same folder or below.',
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["**/*.{ts,tsx,mts}"],
    rules: {
      "no-restricted-imports": ["error", { patterns: [noParentImports] }],
    },
  },
  // Import boundaries between the app and resume Themes.
  //
  // The app (components/) and each Theme (themes/) must stay independent:
  // changing the app's look must never change how a Resume renders, and a
  // Theme must never leak into the rest of the site. These rules block
  // imports across that line. Only the preview pane may import a Theme,
  // because it is where a Theme is shown.
  //
  // This only covers imports. Keeping CSS variables apart (app tokens in
  // app/globals.css, Theme variables prefixed per Theme and scoped to its
  // page) is still a naming convention.
  {
    files: ["themes/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            noParentImports,
            {
              group: ["@/components/**"],
              message: "Themes must not use app components. Keep the Theme self-contained.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["components/**/*.{ts,tsx}"],
    ignores: ["components/editor/preview-pane/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            noParentImports,
            {
              group: ["@/themes/**"],
              message: "App components must not use Theme code. Only the preview pane shows a Theme.",
            },
          ],
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
