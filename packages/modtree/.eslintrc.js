const config = require('config/eslint-backend')
module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  ...config,
}
