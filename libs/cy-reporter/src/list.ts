import './env'
import { In, Repository } from 'typeorm'
import { CypressRun } from './entity'
import { green, red, gray, Chalk } from 'chalk'
import { ancestryPath } from './git'
import { resolve } from 'path'
import { getAllFiles } from './files'
import { client } from './client'

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

// run main under an initialized connection
// init.then((repo) => main(repo)).then(() => db.destroy())

const main2 = () => {
  const specRoot = resolve(__dirname, '../../..', 'apps/web-e2e')
  const params = {
    files: getAllFiles(specRoot).filter((f) => f.endsWith('.cy.ts')),
    commits: ancestryPath('origin/main', 'HEAD'),
  }
  client.get('/list', { params }).then((res) => {
    const results: Result[] = res.data
    results.forEach((res) => {
      print[res.state](res.shortHash, res.file)
    })
  })
}
main2()
