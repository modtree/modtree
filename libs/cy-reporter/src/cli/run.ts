import { fork, spawn, spawnSync } from 'child_process'
import { resolve } from 'path'
import { paths } from '../config'
import { log } from '../utils'
import { gray, blue } from 'chalk'
import type { Readable } from 'stream'
import type { ChildProcessByStdio } from 'child_process'

type ChildProcess = ChildProcessByStdio<null, Readable, Readable>

function hasBin(bin: string): boolean {
  return spawnSync('which', [bin]).status === 0
}

function run(specFile: string) {
  return fork(paths.executable.run, [specFile])
}

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
  return fzf
}

function selectWithShell(specDir: string) {
  console.log('Select a spec file to run', gray('(tab completion available)'))
  console.log('path:', blue(specDir))
  const prompt = '> '
  const sh = spawn('sh', ['-c', `read -e -p "${prompt}" T && echo $T`], {
    cwd: specDir,
    stdio: ['inherit', 'pipe', 'pipe'],
  })
  // reflect stderr (sh tab complete suggestions)
  sh.stderr.on('data', (d) => process.stderr.write(d))
  sh.stdout.setEncoding('utf8')
  return sh
}

/**
 * returns a child process whose first stdout has to be the path of the
 * spec file relative to the specDir provided
 * @param {string} specDir
 * @returns {ChildProcess}
 */
function getSelector(specDir: string): ChildProcess {
  const forceSh = false
  const hasFzf = hasBin('fzf')
  if (!hasFzf || forceSh) {
    return selectWithShell(specDir)
  }
  return selectWithFzf(specDir)
}

export function selectAndRun(specDir: string) {
  const p = getSelector(specDir)
  p.stdout.on('data', (data: string) => {
    const target = data.trim()
    log.green('Running test:', target)
    run(resolve(specDir, target))
  })
}
