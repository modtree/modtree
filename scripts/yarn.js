const { spawnSync } = require('child_process')
const { resolve } = require('path')
const { lstatSync, readlinkSync, existsSync } = require('fs')
const { green, yellow } = require('chalk')

// paths
const rootDir = resolve(__dirname, '..')
const root = (...p) => resolve(rootDir, ...p)

const log = {
  yellow: (...t) => console.log(yellow(...t)),
  green: (...t) => console.log(green(...t)),
}

/**
 * symlinks a file
 *
 * @param {string} src - source directory
 * @param {string} dst - destination directory
 * @param {string} srcFile
 * @param {string} dstFile
 * @returns {string} full path to destination
 */
function symlink(src, dst, srcFile, dstFile = '') {
  const fullDst = resolve(dst, dstFile || srcFile)
  spawnSync('ln', ['-sf', resolve(src, srcFile), fullDst])
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

/**
 * logs the success status of the symlink execution
 * @param {string} link
 * @param {string} file
 * @return {boolean} if it's a success
 */
function logStatus(link, file) {
  // check that symlink exists
  const lstat = lstatSync(link, { throwIfNoEntry: false })
  if (!lstat || !lstat.isSymbolicLink()) {
    log.yellow(` ✗ ${file} not loaded`)
    return false
  }
  // check that symlink points to a file that exists
  if (!existsSync(readlinkSync(link))) {
    log.yellow(` ✗ ${file} symlink broken`)
    return false
  }
  log.green(` ✓ ${file} loaded`)
  return true
}

/**
 * load all env files from the source directory
 * @param {string} source
 */
function loadEnv(source) {
  envFiles.forEach(({ file, target }) => {
    const link = symlink(source, target, file)
    logStatus(link, file)
  })
}

/**
 * when there is no source directory
 * this uses .env.example as the .env file
 */
function loadFallback() {
  log.yellow('$MODTREE_ENV_SOURCE not found, falling back on standard env')
  const link = symlink('.', '.', '.env.example', '.env')
  logStatus(link, '.env')
}

/**
 * source the secret env files based on the
 * MODTREE_ENV_SOURCE environment variable
 */
;(() => {
  // don't load any environment variables on CI runs
  if (process.env.CI) return
  const source = process.env.MODTREE_ENV_SOURCE
  source ? loadEnv(source) : loadFallback()
})()
