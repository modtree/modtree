const { spawn, ChildProcessWithoutNullStreams } = require('child_process')
const { blue, green, yellow, gray } = require('chalk')
const g = (...a) => console.log(gray(...a))

/**
 * @param {string} name
 * @param {string[]} args
 * @returns {ChildProcessWithoutNullStreams}
 */
function yarn(name, args) {
  const color = colors.pop()
  const fancy = '[' + color(name) + ']'
  const p = spawn('yarn', args)
  p.stdout.setEncoding('utf8')
  p.stderr.setEncoding('utf8')
  p.stdout.on('data', (d) => g(fancy, d.trim()))
  p.stderr.on('data', (d) => g(fancy, d.trim()))
  p.on('exit', (_, s) => {
    if (s === 'SIGINT') {
      g(fancy, gray(`exited.`))
    }
  })
  return p
}

const colors = [blue, green, yellow]
const builds = [
  { name: 'web', args: ['build:web'] },
  { name: 'server', args: ['build:server'] },
  { name: 'docs', args: ['build:docs'] },
]
const processes = builds.map((b) => yarn(b.name, b.args))

function wipe() {
  processes.forEach((p) => {
    if (p) {
      p.kill()
    }
  })
}

process.on('SIGINT', () => wipe())
process.on('exit', () => wipe())
