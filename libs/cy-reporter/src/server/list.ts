import '../env'
import { In, Repository } from 'typeorm'
import { CypressRun } from '../entity'
import { green, red, gray, Chalk } from 'chalk'

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
const p =
  (c: Chalk, i: string) =>
  (hash: string, ...s: any) =>
    console.log(gray(` ${hash}`), c(`${i}`), c(...s))

const print = {
  [State.PASS]: p(green, '✓'),
  [State.NORES]: p(gray, '*'),
  [State.FAIL]: p(red, '✗'),
}

export const list = async (
  repo: Repository<CypressRun>,
  files: string[],
  commits: string[]
) => {
  return repo.findBy({ gitHash: In(commits), file: In(files) }).then((res) => {
    return (
      files
        .map((file) => {
          let [state, shortHash] = [State.NORES, '        ']
          const data = res.filter((r) => r.file === file)
          // modify the state and shortHash if data is found
          if (data.length > 0) {
            const latest = data.sort((a, b) => b.timestamp - a.timestamp)[0]
            shortHash = latest.gitHash.slice(0, 8)
            state = latest.pass ? State.PASS : State.FAIL
          }
          // return the state for sorting later
          // return the printer to execute after sorting
          return {
            state,
            print: () => print[state](shortHash, file),
            file,
            shortHash,
          }
        })
        // sort by state
        .sort((a, b) => a.state - b.state)
    )
  })
}
