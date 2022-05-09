module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "google",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ], // let prettier configs override formatting
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  ignorePatterns: [
    '/lib/**/*', // Ignore built files.
    '.eslintrc.js', // Ignore this file.
  ],
  plugins: ['@typescript-eslint', 'import'],
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
