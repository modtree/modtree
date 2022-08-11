const { spawn, ChildProcessWithoutNullStreams } = require('child_process')
const { blue, green, yellow, gray } = require('chalk')
const g = (...a) => console.log(gray(...a))

/**
 * @param {string} name
 * @param {string} cmd
 * @param {string[]} args
 * @returns {ChildProcessWithoutNullStreams}
 */
function run(name, cmd, args) {
  const color = colors.pop()
  const fancy = '[' + color(name) + ']'
  const p = spawn(cmd, args)
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
  { name: 'web', cmd: 'yarn', args: ['build:web'] },
  { name: 'server', cmd: 'yarn', args: ['build:server'] },
  { name: 'docs', cmd: 'yarn', args: ['build:docs'] },
]
const processes = builds.map((b) => run(b.name, b.cmd, b.args))

function wipe() {
  processes.forEach((p) => {
    if (p) {
      p.kill()
    }
  })
}

process.on('SIGINT', () => wipe())
process.on('exit', () => wipe())
