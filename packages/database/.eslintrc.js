const config = require('modtree-config/eslint-backend')
module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  ...config,
  ignorePatterns: [
    ...config.ignorePatterns,
    'babel.config.js',
    'types/*',
    'tests/*',
  ],
}
