import { spawnSync } from 'child_process'

function getStdout(cmd: string, args: string[] = []) {
  return (
    spawnSync(cmd, args, {
      encoding: 'utf8',
    }).output[1] || ''
  ).trimEnd()
}

/**
 * extract epoch time (in milliseconds) from a commit id or a reference
 */
export function getCommitTime(commitId: string): number {
  const output = getStdout('git', ['show', '-s', '--format=%ci', commitId])
  return new Date(output).getTime()
}

/**
 * get current git hash, specifically of HEAD
 */
export function getCurrentHash(): string {
  const output = getStdout('git', ['rev-parse', 'HEAD'])
  return output.slice(0, 12)
}
