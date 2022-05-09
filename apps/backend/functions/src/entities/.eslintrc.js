module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'google',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
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
    '@typescript-eslint/no-namespace': 'off',
    quotes: ['error', 'single'],
    semi: ['error', 'never'],
    'max-len': 'off',
    'import/no-unresolved': 0,
    'object-curly-spacing': ['error', 'always'],
    'new-cap': 'off',
    'require-jsdoc': 'off',
  },
}
