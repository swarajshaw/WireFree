const js = require("@eslint/js");
const nextPlugin = require("@next/eslint-plugin-next");
const tsParser = require("@typescript-eslint/parser");
const tsPlugin = require("@typescript-eslint/eslint-plugin");
const reactPlugin = require("eslint-plugin-react");
const reactHooksPlugin = require("eslint-plugin-react-hooks");
const jsxA11yPlugin = require("eslint-plugin-jsx-a11y");
const importPlugin = require("eslint-plugin-import");
const globals = require("globals");

const nextCoreWebVitals = nextPlugin.configs["core-web-vitals"];

module.exports = [
  js.configs.recommended,
  {
    ignores: ["node_modules/**", ".next/**", "dist/**", "coverage/**"],
  },
  {
    files: ["**/__tests__/**", "**/*.test.*", "**/*.spec.*"],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
  {
    files: ["**/next-env.d.ts"],
    rules: {
      "import/no-unresolved": "off",
    },
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      "@next/next": nextPlugin,
      "@typescript-eslint": tsPlugin,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "jsx-a11y": jsxA11yPlugin,
      import: importPlugin,
    },
    settings: {
      react: {
        version: "detect",
      },
      "import/resolver": {
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      },
    },
    rules: {
      ...nextCoreWebVitals.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      ...jsxA11yPlugin.configs.recommended.rules,
      ...importPlugin.configs.recommended.rules,
      "jsx-a11y/label-has-associated-control": "warn",
      "react-hooks/set-state-in-effect": "off",
      "no-unused-vars": "warn",
      "@next/next/no-html-link-for-pages": "warn",
      "react/react-in-jsx-scope": "off",
    },
  },
];
