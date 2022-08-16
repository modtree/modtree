const { readdirSync, existsSync, lstat, readlink } = require('fs')
const { spawnSync, spawn } = require('child_process')
const { resolve, dirname } = require('path')

const binDir = resolve(__dirname, 'bin')

/**
 * build all cli tools
 */
function build() {
  spawnSync('yarn', ['cli:build'], { stdio: 'inherit' })
}

/**
 * use the first argument as the file from binDir to run
 * and pass the rest of the arguments
 */
function main() {
  const args = process.argv.slice(2)
  const cliTool = args.shift()
  spawn('node', [resolve(binDir, cliTool), ...args], { stdio: 'inherit' })
}

/**
 * asynchronously checks if a filepath points to a valid file
 *
 * @param {string} fp - filepath
 * @returns {boolean} if it is a valid symlink
 */
async function validSymlink(fp) {
  const dir = dirname(fp)
  return new Promise((res) => {
    lstat(fp, (_, s) => {
      // if the file is not a symlink, resolve with false
      if (!s.isSymbolicLink()) return res(s.isFile())
      // check if the symlink points to a file that exists
      readlink(fp, (_, t) => res(existsSync(resolve(dir, t))))
    })
  })
}

/**
 * build everything if any build output is not present,
 * and only then run
 */
const buildPaths = readdirSync(binDir).map((f) => resolve(binDir, f))
Promise.all(buildPaths.map(validSymlink))
  .then((exists) => exists.every(Boolean))
  .then((built) => {
    if (!built) build()
    main()
  })
