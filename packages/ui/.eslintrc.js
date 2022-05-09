const config = require('config/eslint-frontend')

module.exports = {
  ...config,
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2015,
  },
}
