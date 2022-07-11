import { ModuleRepository } from '@modtree/repos'
import { mocks } from '@modtree/test-env'
import '@modtree/test-env/jest'
import { Module } from '@modtree/types'

jest.mock('../../base')
jest.mock('../../module')

const moduleRepo = new ModuleRepository(mocks.db)
let received: Module
const init = {
  id: '58201858-5ce5-4ceb-8568-eecf55841b9f',
  title: 'Test Module',
  moduleCode: 'TST1000MD',
  prereqTree: { and: ['CS1010S', 'MA1100'] },
  prerequisite: '',
  corequisite: '',
  preclusion: '',
  fulfillRequirements: ['CS2040S'],
}

it('returns a module', async () => {
  await moduleRepo.initialize(init).then((res) => {
    expect(res).toBeInstanceOf(Module)
    received = res
  })
})

test('saved all information', () => {
  const correct: [any, any][] = [
    [received.id, init.id],
    [received.title, init.title],
    [received.moduleCode, init.moduleCode],
    [received.prereqTree, init.prereqTree],
    [received.prerequisite, init.prerequisite],
    [received.corequisite, init.corequisite],
    [received.preclusion, init.preclusion],
    [received.fulfillRequirements, init.fulfillRequirements],
  ]
  correct.forEach(([received, expected]) => expect(received).toEqual(expected))
})
