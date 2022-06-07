/**
 * database root config
 */
module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'airbnb-base',
    'airbnb-typescript/base',
    'modtree',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:jsdoc/recommended',
    'prettier',
  ],
  plugins: ['import', '@typescript-eslint', 'jsdoc'],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.d.ts'],
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts', '.d.ts'],
        project: ['tsconfig.json'],
      },
      typescript: {
        alwaysTryTypes: true,
        project: ['tsconfig.json'],
      },
    },
  },
  ignorePatterns: ['src/migrations/*', 'scripts.js'],
  rules: {
    'no-useless-escape': 0, // some seemingly useless escapes are actually required
    'new-cap': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-shadow': 0,
    'import/prefer-default-export': 0,
    'no-param-reassign': 0,
    'no-plusplus': 0,
    'no-await-in-loop': 0,
    'no-console': 0,
    '@typescript-eslint/no-loop-func': 0,
    'no-promise-executor-return': 0,
    'max-classes-per-file': 0,
    '@typescript-eslint/no-use-before-define': 0,
    // jsdoc chill out pls
    'jsdoc/require-param-description': 0,
    'jsdoc/require-property-description': 0,
    'jsdoc/require-returns-description': 0,
    'jsdoc/require-example': 0,
    'jsdoc/no-undefined-types': [
      'error' | 'warn',
      { definedTypes: ['T'] }, // allow the use of T in jsdoc types
    ],
  },
  overrides: [
    {
      env: {
        jest: true,
      },
      files: ['**/tests/**/*.test.[jt]s'],
      extends: ['plugin:jest/recommended'],
    },
  ],
}
