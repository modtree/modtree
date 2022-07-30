import './env'
import { init, db } from './data-source'
import { Repository } from 'typeorm'
import { CypressRun } from './entity'
import { green, red, gray, Chalk } from 'chalk'
import { getHash, isAncestor } from './git'

/**
 * only consider commits that are:
 *  1. ancestors of current commit (HEAD)
 *  2. are descendants of origin/main
 *  3. are not the same commit as origin/main
 *
 * @param {string} gitHash
 * @returns {boolean}
 */
const validCommit = (gitHash: string): boolean => {
  return [
    // test hash is ancestor of current commit
    isAncestor(gitHash, 'HEAD'),
    // test hash is descendant of origin/main
    isAncestor('origin/main', gitHash),
    // test hash is not origin/main itself
    getHash('origin/main') !== getHash(gitHash),
  ].every(Boolean)
}

/**
 * possible states of a test
 *
 * changing the order of this enum definition will change the order
 * in which the tests are displayed.
 */
enum State {
  PASS,
  NORES, // no result
  FAIL,
}

/** pretty printer */
const p = (c: Chalk, i: string) => (s: string) => console.log(c(` ${i}`, s))
const log = {
  [State.PASS]: p(green, '✓'),
  [State.NORES]: p(gray, '*'),
  [State.FAIL]: p(red, '✗'),
}

const main = async (repo: Repository<CypressRun>) => {
  return repo.find().then((res) => {
    console.log(res, res.length)
  })
}

// run main under an initialized connection
init.then((repo) => main(repo)).then(() => db.destroy())
