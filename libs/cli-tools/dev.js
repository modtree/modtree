const Runner = require('../../scripts/runner')
const compiler = require('./webpack')
const hasArg = (a) => process.argv.slice(2).includes(a)
const { resolve, relative, dirname } = require('path')
const { symlink, rmSync, mkdirSync } = require('fs')
const rootDir = resolve(__dirname, '../..')

const binDir = resolve(__dirname, 'bin')
const bin = (f) => resolve(binDir, f)

const file = (() => {
  if (hasArg('--server')) return 'server.js'
  if (hasArg('--cli')) return 'cli.js'
  return ''
})()

const runner = new Runner(compiler, file)
runner.run()

/**
 * make a relative symlink so it works on every system
 */
function relativeSymlink(target, filepath) {
  symlink(relative(dirname(filepath), target), filepath, 'file', () => true)
}

if (hasArg('--build')) {
  // clear the bin directory
  rmSync(binDir, { recursive: true })
  mkdirSync(binDir)
  // create symlinks to build output directory
  Object.keys(compiler.options.entry).forEach((f) => {
    const target = resolve(compiler.outputPath, f + '.js')
    const path = resolve(binDir, f)
    relativeSymlink(target, path)
  })
  // create symlinks for cypress reporters
  const reporterDir = resolve(rootDir, 'apps/web-e2e/reporters')
  const linkList = [
    { target: bin('cypress:json'), path: resolve(reporterDir, 'json.js') },
    { target: bin('cypress:sender'), path: resolve(reporterDir, 'sender.js') },
  ]
  linkList.forEach(({ target, path }) => relativeSymlink(target, path))
}
