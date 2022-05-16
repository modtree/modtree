module.exports = {
  extends: ["prettier"], // let prettier configs override formatting
  settings: {
    next: {
      rootDir: ["apps/*/", "packages/*/"],
    },
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "tsconfig.json",
    sourceType: "module",
  },
  ignorePatterns: [
    "/lib/**/*", // Ignore built files.
    ".eslintrc.js", // Ignore this file.
    "/coverage/**/*", // Ignore coverage files
  ],
  rules: {
    "max-len": ["off", 0],
    indent: ["error", 2],
    quotes: ["error", "single"],
    semi: ["error", "never"],
    "object-curly-spacing": ["error", "always"],
    "import/no-unresolved": "off",
    "@typescript-eslint/no-explicit-any": "off",
  },
};
