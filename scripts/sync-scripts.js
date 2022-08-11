/**
 * sync package.scripts.js with package.json
 */
const { resolve } = require('path')
const { writeFileSync } = require('fs')

// insert scripts into existing config
const data = {
  ...require('../package.json'),
  scripts: require('../package.scripts'),
}

// write to package.json
const str = JSON.stringify(data, null, 2)
writeFileSync(resolve(__dirname, '../package.json'), str)
