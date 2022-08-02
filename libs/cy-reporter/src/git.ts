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
 * get current git hash, specifically of HEAD
 *
 * @param {number} length
 * @returns {string}
 */
export function getCurrentHash(length?: number): string {
  const output = getStdout('git', ['rev-parse', 'HEAD'])
  return length ? output.slice(0, length) : output
}

/**
 * get list of all hashes between two commits
 * note that the returned array doesn't include the ancestor commit
 *
 * @param {string} ancestor
 * @param {string} descendant
 * @returns {string[]} commits excluding ancestor including descendant
 */
export function ancestryPath(ancestor: string, descendant: string): string[] {
  const output = spawnSync(
    'git',
    ['rev-list', '--ancestry-path', `${ancestor}..${descendant}`],
    {
      encoding: 'utf8',
    }
  ).output[1]
  return output ? output.trimEnd().split('\n') : []
}
