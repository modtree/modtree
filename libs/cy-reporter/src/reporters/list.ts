import '../env'
import { green, red, gray, Chalk } from 'chalk'
import { resolve } from 'path'
import { ancestryPath } from '../git'
import { getAllFiles, client } from '../utils'

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

type Result = {
  state: State
  file: string
  shortHash: string
}

/** pretty printer */
const p =
  (c: Chalk, i: string) =>
  (hash: string, ...s: any) =>
    console.log(gray(` ${hash}`), c(`${i}`), c(...s))

const print = {
  [State.PASS]: p(green, '✓'),
  [State.NORES]: p(gray, '*'),
  [State.FAIL]: p(red, '✗'),
}

const main2 = () => {
  const specRoot = resolve(__dirname, '../../..', 'apps/web-e2e')
  const params = {
    files: getAllFiles(specRoot).filter((f) => f.endsWith('.cy.ts')),
    commits: ancestryPath('origin/main', 'HEAD'),
  }
  client
    .get<Result[]>('/list', { params })
    .then((res) => res.data.forEach((r) => print[r.state](r.shortHash, r.file)))
}
main2()
