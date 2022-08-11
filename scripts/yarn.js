const { spawnSync } = require('child_process')
const { resolve } = require('path')
const fs = require('fs')
const rootDir = resolve(__dirname, '..')
const root = (...p) => resolve(rootDir, ...p)
const { green, yellow } = require('chalk')

/**
 * symlinks a file
 *
 * @param {string} src - source directory
 * @param {string} dst - destination directory
 * @param {string} filename
 * @returns {string} full path to destination
 */
function symlink(src, dst, filename) {
  const fullDst = resolve(dst, filename)
  spawnSync('ln', ['-sf', resolve(src, filename), fullDst])
  return fullDst
}

const envFiles = [
  {
    file: '.env',
    target: root(),
  },
  {
    file: 'cypress.env.json',
    target: root('apps/web-e2e'),
  },
]

envFiles.forEach(({ file, target }) => {
  const link = symlink(process.env.MODTREE_ENV_SOURCE, target, file)
  // check that symlink exists
  const lstat = fs.lstatSync(link, { throwIfNoEntry: false })
  if (!lstat || !lstat.isSymbolicLink()) {
    console.log(yellow(` ✗ [ ${file} ] not loaded.`))
    return
  }
  // check that symlink points to a file that exists
  if (!fs.existsSync(fs.readlinkSync(link))) {
    console.log(yellow(` ✗ [ ${file} ] symlink broken.`))
    return
  }
  console.log(green(` ✓ [ ${file} ] loaded.`))
})
