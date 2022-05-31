const config = require('modtree-config/eslint-backend')
module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  ...config,
  parserOptions: {
    project: "eslint.tsconfig.json",
    sourceType: "module",
  },
  ignorePatterns: [...config.ignorePatterns, 'src/migrations/*'],
  rules: {
    ...config.rules,
    'no-useless-escape': 'off', // some seemingly useless escapes are actually required
    'new-cap': 'off',
  },
}
