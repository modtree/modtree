import { fork, spawn } from 'child_process'
import { resolve } from 'path'
import { log } from '../utils'

function selectWithFzf(specDir: string) {
  const fzf = spawn(
    'fzf',
    [
      '+m',
      '--height=7',
      '--no-mouse',
      '--reverse',
      '--no-info',
      '--header=Select a cypress test:',
      '--header-first',
      '--color=pointer:green,header:white',
    ],
    {
      cwd: specDir,
      stdio: ['inherit', 'pipe', 'pipe'],
    }
  )
  // reflect stderr (fzf search suggestions)
  fzf.stderr.on('data', (d) => process.stderr.write(d))
  // handle stdout (fzf selected entry)
  fzf.stdout.setEncoding('utf8')
  fzf.stdout.on('data', (data: string) => {
    const target = data.trim()
    log.green('Running test:', target)
    // fork(exe.run, [resolve(specDir, target)])
  })
}

function run(specDir: string) {}
