const config = require('modtree-config/eslint-backend')
module.exports = {
  ...config,
  env: {
    'jest/globals': true,
  },
  plugins: [...config.plugins, 'jest'],
  rules: {
    ...config.rules,
    'new-cap': 'off',
  },
}
