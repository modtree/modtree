import '../env'
import { green, red, gray, Chalk } from 'chalk'
import { resolve } from 'path'
import { ancestryPath } from '../git'
import { getAllFiles, client } from '../utils'
import type { Result, State } from '../types'

/**
 * changing the order of this enum definition will change the order
 * in which the tests are displayed.
 */
const order: State[] = ['pass', 'nores', 'fail']

/** pretty printer */
const p =
  (c: Chalk, i: string) =>
  (hash: string, ...s: any) =>
    console.log(gray(` ${hash}`), c(`${i}`), c(...s))

const print: Record<State, any> = {
  pass: p(green, '✓'),
  nores: p(gray, '*'),
  fail: p(red, '✗'),
}

const specRoot = resolve(__dirname, '../../..', 'apps/web-e2e')
const params = {
  files: getAllFiles(specRoot).filter((f) => f.endsWith('.cy.ts')),
  commits: ancestryPath('origin/main', 'HEAD'),
}
client.get<Result[]>('/list', { params }).then((res) =>
  res.data
    .sort((a, b) => order.indexOf(a.state) - order.indexOf(b.state))
    .forEach((r) => {
      console.log('----', r.state)
      print[r.state](r.shortHash, r.file)
    })
)
