const base = require("./eslint-base");
module.exports = {
  ...base,
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "google",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ], // let prettier configs override formatting
  plugins: ["@typescript-eslint", "import"],
  rules: {
    ...base.rules,
    "@typescript-eslint/no-namespace": "off",
  },
};
