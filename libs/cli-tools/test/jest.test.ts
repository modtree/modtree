import type { SpawnSyncReturns } from 'child_process'
import { helpText } from '../src/jest/help'
import { getShellOutput } from './test-utils'

let p1: SpawnSyncReturns<string>
let p2: SpawnSyncReturns<string>

beforeAll(() => {
  p1 = getShellOutput('yarn', ['--silent', 'test'])
  p2 = getShellOutput('yarn', ['--silent', 'test', 'utils'])
})

describe('yarn test', () => {
  test('exits with code 0', () => {
    expect(p1.status).toBe(0)
  })

  test('help text on no args', () => {
    expect(p1.stdout).toBe(helpText)
  })
})

describe('yarn test utils', () => {
  test('exits with code 0', () => {
    expect(p2.status).toBe(0)
  })

  test('help text on no args', () => {
    expect(p2.stdout).toBe('')
  })
})
