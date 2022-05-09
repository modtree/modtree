const base = require("./eslint-base");
module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@next/next/recommended",
    "prettier",
  ],
  settings: {
    next: {
      rootDir: ["apps/*/", "packages/*/"],
    },
    react: {
      version: "detect",
    },
  },
  rules: {
    ...base.rules,
    "@next/next/no-html-link-for-pages": "off",
    "react/react-in-jsx-scope": "off",
  },
};
