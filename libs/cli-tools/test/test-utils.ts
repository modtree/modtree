import { spawnSync } from 'child_process'

export function getShellOutput(cmd: string, args: string[]) {
  const p = spawnSync(cmd, args, { encoding: 'utf8' })
  // remove last newline, but not all ending newlines
  p.stdout = p.stdout.replace(/\n$/, '')
  return p
}
