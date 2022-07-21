import { ModuleCondensedRepository } from '@modtree/repos'
import { ModuleCondensed } from '@modtree/types'
import { mocks } from '@modtree/test-env'
import '@modtree/test-env/jest'

jest.mock('../../base')

const moduleCondensedRepo = new ModuleCondensedRepository(mocks.db)
let received: ModuleCondensed

it('returns a condensed module', async () => {
  await moduleCondensedRepo
    .initialize('Test Module', 'TST1000MD')
    .then((res) => {
      expect(res).toBeInstanceOf(ModuleCondensed)
      received = res
    })
})

test('saved all information', () => {
  const correct: [any, any][] = [
    [received.title, 'Test Module'],
    [received.moduleCode, 'TST1000MD'],
    [received.moduleLevel, 1000],
  ]
  correct.forEach(([received, expected]) => expect(received).toEqual(expected))
})
