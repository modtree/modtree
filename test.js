const { spawnSync } = require('child_process')

const sha = spawnSync('git', ['rev-parse', 'HEAD'], {
  encoding: 'utf8',
}).output[1].trimEnd()
console.log(sha.slice(0, 12))
