const { spawnSync } = require('child_process')

const sha = spawnSync('git', ['status', '--porcelain'], {
  encoding: 'utf8',
}).output[1]
const count = (sha.match(/\n/) || []).length
console.log(count)
