import { ModuleRepository } from '@modtree/repos'
import { mocks } from '@modtree/test-env'
import '@modtree/test-env/jest'
import { Module } from '@modtree/types'
import database from './can-take-module.json'

const findByCode: Record<string, Partial<Module>> = database.moduleRepo
  .findByCode

jest.mock('../../base')
jest.mock('../repo', () => {
  const M = jest.requireActual('../repo')
  const R: typeof ModuleRepository = M.ModuleRepository
  R.prototype.findByCode = async (moduleCode: string) => {
    const tree = findByCode[moduleCode]
    return Object.assign(new Module(), tree)
  }
  return { ModuleRepository: R }
})

const moduleRepo = new ModuleRepository(mocks.db)

const correct = [
  { done: ['MA2001'], doing: ['MA2219'], tested: 'MA2101', expected: true },
  { done: ['MA2001'], doing: ['MA2219'], tested: 'MA1100', expected: false },
  { done: ['MA2001'], doing: ['MA2219'], tested: 'CS2040S', expected: false },
  { done: ['MA2001'], doing: ['MA2219'], tested: 'CS1010S', expected: true },
  { done: ['MA2001'], doing: [], tested: 'MA2001', expected: false },
  { done: [], doing: ['MA2001'], tested: 'MA2001', expected: false },
  { done: ['CM1102'], doing: ['CS1010'], tested: 'NOT_VALID', expected: false },
]

test.each(correct)(
  `test: $tested, expect: $expected
    done: $done
    doing: $doing`,
  async ({ done, doing, tested, expected }) => {
    const received = await moduleRepo.canTakeModule(done, doing, tested)
    expect(received).toBe(expected)
  }
)
