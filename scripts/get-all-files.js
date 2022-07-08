const fs = require('fs')
const path = require('path')

/**
 * gets all files recursively under the root provided
 */
const getAllFiles = (root, ignore = []) => {
  const allFiles = []
  const ls = (cwd) => {
    fs.readdirSync(cwd)
      .filter((x) => !ignore.includes(x))
      .forEach((file) => {
        const filepath = path.resolve(cwd, file)
        if (fs.lstatSync(filepath).isDirectory()) {
          ls(path.resolve(cwd, file))
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

module.exports = getAllFiles
