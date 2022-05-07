module.exports = {
  extends: ["prettier"],
  settings: {
    next: {
      rootDir: ["apps/*/", "packages/*/"],
    },
  },
  rules: {
    "max-len": ["off", 0],
    indent: [1, 2],
    quotes: ["error", "single"],
    semi: ["error", "never"],
    "object-curly-spacing": ["error", "always"],
    "import/no-unresolved": 0,
    "@typescript-eslint/no-explicit-any": "off",
  },
};
