import { spawnSync } from 'child_process'

/**
 * gets stdout of a shell command
 */
function getStdout(cmd: string, args: string[] = []) {
  return (
    spawnSync(cmd, args, {
      encoding: 'utf8',
    }).output[1] || ''
  ).trimEnd()
}

/**
 * extract epoch time (in milliseconds) from a commit id or a reference
 *
 * @param {string} commitId
 * @returns {number} epoch time
 */
export function getCommitTime(commitId: string): number {
  const output = getStdout('git', ['show', '-s', '--format=%ci', commitId])
  return new Date(output).getTime()
}

/**
 * get current git hash, specifically of HEAD
 *
 * @returns {string}
 */
export function getCurrentHash(): string {
  const output = getStdout('git', ['rev-parse', 'HEAD'])
  return output.slice(0, 12)
}

/**
 * checks if a commit hash is ancestor of another
 *
 * @param {string} ancestor
 * @param {string} child
 * @returns {boolean}
 */
export function isAncestor(ancestor: string, child: string): boolean {
  return (
    spawnSync('git', ['merge-base', '--is-ancestor', ancestor, child], {
      encoding: 'utf8',
    }).status === 0
  )
}
