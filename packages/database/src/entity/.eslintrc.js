const config = require('modtree-config/eslint-backend')
module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  ...config,
  rules: {
    ...config.rules,
    'new-cap': 'off',
  },
}
