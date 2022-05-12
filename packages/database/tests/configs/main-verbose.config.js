const main = require('./main.config')

// ignore fetch to reduce strain on NUSMods API
module.exports = {
  ...main,
  silent: false,
}
