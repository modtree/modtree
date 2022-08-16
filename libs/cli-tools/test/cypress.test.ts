import type { SpawnSyncReturns } from 'child_process'
import { helpText } from '../src/cypress/cli/help'
import { getShellOutput } from './test-utils'

let p1: SpawnSyncReturns<string>

beforeAll(() => {
  p1 = getShellOutput('yarn', ['--silent', 'cy'])
})

describe('yarn cy', () => {
  test('exits with code 0', () => {
    expect(p1.status).toBe(0)
  })

  test('help text on no args', () => {
    expect(p1.stdout).toBe(helpText)
  })
})
