const { spawnSync } = require('child_process')

const current = '1a394a0d'
const ancestor = '1a5e2ea6'
const not = 'b7cbf26e'
const correct = false
const sha = spawnSync(
  'git',
  ['merge-base', '--is-ancestor', correct ? ancestor : not, current],
  {
    encoding: 'utf8',
  }
).status
console.log(sha)
