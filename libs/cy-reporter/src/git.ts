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
 * @param {number} length
 * @returns {string}
 */
export function getCurrentHash(length?: number): string {
  const output = getStdout('git', ['rev-parse', 'HEAD'])
  return length ? output.slice(0, length) : output
}

/**
 * get git hash
 *
 * @param {string} ref
 * @returns {string}
 */
export function getHash(ref: string): string {
  return getStdout('git', ['rev-parse', ref])
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

/**
 * checks if there are uncommitted changes
 *
 * @returns {boolean}
 */
export function hasUncommittedChanges(): boolean {
  const output = spawnSync('git', ['status', '--porcelain'], {
    encoding: 'utf8',
  }).output[1]
  return (output?.match(/\n/) || []).length === 0
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
