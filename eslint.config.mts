import stylistic from "@stylistic/eslint-plugin";
import eslintPluginImport from "eslint-plugin-import";
import prettier, {rules} from "eslint-plugin-prettier";
import eslitCheckFilePlugin from "eslint-plugin-check-file";
import tsConfig from "typescript-eslint";
import globals from "globals";
import js from "@eslint/js";
import {defineConfig} from "eslint/config";

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export default defineConfig([
  {files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"]},
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: {js},
    languageOptions: {globals: globals.node},
  },
  {
    ignores: ["node_modules"],
  },
  // Generals
  {
    plugins: {
      "@stylistic": stylistic,
    },
    rules: {
      "@stylistic/padding-line-between-statements": [
        "warn",
        {blankLine: "always", prev: "*", next: ["return", "export"]},
        {blankLine: "always", prev: ["const", "let", "var"], next: "*"},
        {blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"]},
      ],
      "no-unused-vars": "off",
    },
  },
  // Prettier
  {
    plugins: {
      prettier: prettier,
    },
    rules: {
      "prettier/prettier": [
        "warn",
        {
          printWidth: 100,
          trailingComma: "all",
          tabWidth: 2,
          semi: true,
          singleQuote: false,
          bracketSpacing: false,
          arrowParens: "always",
          endOfLine: "auto",
        },
      ],
    },
  },
  // Typescript
  tsConfig.configs.strict,
  tsConfig.configs.stylistic,
	{
		rules: {
			"@typescript-eslint/no-unused-vars": "warn"
		}
	},
  // },
  // {
  //         plugins: {
  //                 "@typescript": tsConfig.plugin,
  //         },
  //         languageOptions: {
  //                 parser: tsConfig.parser,
  //         },
  //         rules: {
  //                 ...tsConfig.configs.recommended,
  //                 "@typescript/no-explicit-any": "error",
  //                 // "@typescript/no-unused-vars": "warn",
  //                 "@typescript/array-type": ["warn", { default: "generic" }],
  //         },
  // },
  // Imports
  {
    plugins: {
      "@import": eslintPluginImport,
    },
    rules: {
      "@import/order": [
        "warn",
        {
          groups: [
            "type",
            "builtin",
            "object",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          pathGroups: [
            {
              pattern: "@/**",
              group: "external",
              position: "after",
            },
          ],
          "newlines-between": "always",
        },
      ],
    },
  },
  // Files conventions
  {
    files: ["src/*.{js,jsx,ts,tsx}"],
    plugins: {
      "check-file": eslitCheckFilePlugin,
    },
    rules: {
      "check-file/folder-match-with-fex": ["error", {"*.test.js": "**/testing/"}],
      "check-file/filename-naming-convention": [
        "error",
        {
          "**/*.{jsx,tsx}": "KEBAB_CASE",
          "**/*.{js,ts}": "KEBAB_CASE",
          "**/*.d.ts": "KEBAB_CASE",
        },
      ],
      "check-file/folder-naming-convention": [
        "error",
        {
          "src/**/": "KEBAB_CASE",
        },
      ],
    },
  },
]);
