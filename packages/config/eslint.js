module.exports = {
  settings: {
    next: {
      rootDir: ["apps/*/", "packages/*/"],
    },
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["tsconfig.json", "eslint.tsconfig.json"],
    sourceType: "module",
  },
  ignorePatterns: ["/lib/**/*", "/dist/**/*", ".eslintrc.js", "/coverage/**/*"],
  /**
   * formatting-only rules for base rules
   */
  rules: {
    indent: ["error", 2],
    quotes: ["error", "single"],
    semi: ["error", "never"],
    "object-curly-spacing": ["error", "always"],
  },
};
