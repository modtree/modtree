import { readFileSync } from 'fs'
import { resolve } from 'path'
import { getAllFiles, getHash, isAncestor } from '../utils'
import { green, red, gray, Chalk } from 'chalk'
import type { Run, TestData } from './types'

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

/** set paths, gather data */
const rootDir = resolve(__dirname, '../../..')
const e2eDir = resolve(rootDir, 'apps/web-e2e')
const filepath = resolve(e2eDir, 'results.json')
const json: TestData[] = JSON.parse(readFileSync(filepath, 'utf8'))
const cypressTests = getAllFiles(e2eDir).filter((f) => f.endsWith('cy.ts'))

/** derive state of test from data */
const byLatestFirst = (a: Run, b: Run) => (a.timestamp < b.timestamp ? 1 : -1)
const latestRun = (runs: Run[]) => runs.sort(byLatestFirst)[0]
const getState = (data: TestData | undefined): State => {
  // if no data is found, assign the no-result state
  if (!data) return State.NORES
  // else, look for the result of the latest run
  const latest = latestRun(
    data.runs.filter((r) =>
      [
        // test hash is ancestor of current commit
        isAncestor(r.gitHash, 'HEAD'),
        // test hash is descendant of origin/main
        isAncestor('origin/main', r.gitHash),
        // test hash is not origin/main itself
        getHash('origin/main') !== getHash(r.gitHash),
      ].every(Boolean)
    )
  )
  if (!latest) return State.NORES
  return latest.pass ? State.PASS : State.FAIL
}

/** process all the tests and print them */
const main = () =>
  cypressTests
    .map((file) => {
      const data = json.find((t) => t.file === file)
      const state = getState(data)
      return { state, print: () => log[state](file) }
    })
    // sort according to the same order as the enum above
    .sort((a, b) => (a.state > b.state ? 1 : -1))
    // print out the results
    .forEach((f) => f.print())

main()
