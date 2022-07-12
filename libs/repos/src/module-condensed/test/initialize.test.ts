import { ModuleCondensedRepository } from '@modtree/repos'
import { ModuleCondensed } from '@modtree/types'
import { mocks } from '@modtree/test-env'
import '@modtree/test-env/jest'

jest.mock('../../base')

const moduleCondensedRepo = new ModuleCondensedRepository(mocks.db)
let received: ModuleCondensed

const init = {
  id: '58201858-5ce5-4ceb-8568-eecf55841b9f',
  title: 'Test Module',
  moduleCode: 'TST1000MD',
}

it('returns a condensed module', async () => {
  await moduleCondensedRepo.initialize(init).then((res) => {
    expect(res).toBeInstanceOf(ModuleCondensed)
    received = res
  })
})

test('saved all information', () => {
  const correct: [any, any][] = [
    [received.id, init.id],
    [received.title, init.title],
    [received.moduleCode, init.moduleCode],
    [received.moduleLevel, 1000],
  ]
  correct.forEach(([received, expected]) => expect(received).toEqual(expected))
})
