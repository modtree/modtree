/**
 * usage:
 * nested keys will be joined with a colon.
 * keys that are "_" will simply be up until the parent.
 *
 * const scripts = {
 *   ci: {
 *     _: "echo 'hello'"
 *     build: "echo 'world'",
 *   }
 * }
 *
 * will produce these package.json scripts:
 * "scripts": {
 *   "ci": "echo 'hello'"
 *   "ci:build": "echo 'world'"
 * }
 */

const fs = require('fs')
const scripts = require('../scripts')

function fold(tree, parents) {
  Object.keys(tree).forEach((key) => {
    const value = tree[key]
    if (typeof value === 'string') {
      const outputKey =
        key === '_' ? parents.join(':') : [...parents, key].join(':')
      output[outputKey] = value
      return
    }
    fold(tree[key], [...parents, key])
  })
  return tree
}

const output = {}
fold(scripts, [])
const data = JSON.parse(fs.readFileSync('package.json'))
data.scripts = output
fs.writeFileSync('package.json', JSON.stringify(data, null, 2))
