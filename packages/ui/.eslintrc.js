const config = require('modtree-config/eslint-frontend')

module.exports = {
  ...config,
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2015,
  },
}
