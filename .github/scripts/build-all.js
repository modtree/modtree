const { spawn, ChildProcess } = require('child_process')

/**
 * @param {string[]} args
 * @returns {ChildProcess}
 */
function yarn(...args) {
  return spawn('yarn', args, { stdio: 'inherit' })
}

const web = yarn('build:web')
const server = yarn('build:server')
const docs = yarn('build:docs')

const wipe = () => {
  if (web) web.kill()
  if (server) server.kill()
  if (docs) docs.kill()
}

process.on('SIGINT', () => wipe())
process.on('exit', () => wipe())
