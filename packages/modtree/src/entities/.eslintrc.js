const config = require('modtree-config/eslint-backend')

module.exports = {
  env: {
    es6: true,
    node: true,
  },
  ...config,
  rules: {
    ...config.rules,
    'require-jsdoc': 'off',
    'new-cap': 'off',
  },
}
