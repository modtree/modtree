const fs = require('fs')
const path = require('path')

/**
 * @param {string} root
 * @param {string[]} ig - ignore list
 * @returns {string[]} list of files
 */
function getAllFiles(root, ig = []) {
  const allFiles = []
  const ls = (cwd) => {
    fs.readdirSync(cwd)
      .filter((x) => !ig.includes(x))
      .forEach((f) => {
        const filepath = path.resolve(cwd, f)
        if (fs.lstatSync(filepath).isDirectory()) {
          ls(path.resolve(cwd, f))
        } else {
          allFiles.push(filepath)
        }
      })
  }
  ls(root)
  return allFiles
    .map((path) => path.replace(root + '/', ''))
    .filter((entry) => entry !== '')
}

const rootDir = path.resolve(__dirname, '..')
const ig = ['node_modules']
process.chdir(rootDir)
let ok = 0
const jsons = getAllFiles(rootDir, ig).filter((f) => f.endsWith('.json'))
const badJsons = jsons.filter((f) => {
  try {
    JSON.parse(fs.readFileSync(f, 'utf8'))
    ok += 1
    return false
  } catch {
    return true
  }
})
console.log(ok, '/', jsons.length, 'jsons are ok.')
console.log('bad jsons:', badJsons)
