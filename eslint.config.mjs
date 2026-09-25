import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
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
            {
              group: ["@/components/**", "**/components/**"],
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
            {
              group: ["@/themes/**", "**/themes/**"],
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
