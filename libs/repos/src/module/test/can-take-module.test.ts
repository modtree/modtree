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

it('returns correct results', async () => {
  const modulesTested = ['MA2101', 'MA1100', 'CS2040S', 'CS1010S']
  await Promise.all(
    modulesTested.map((x) =>
      moduleRepo.canTakeModule(['MA2001'], ['MA2219'], x)
    )
  ).then((res) => {
    expect(res).toStrictEqual([true, false, false, true])
  })
})

// it('returns false for modules done', async () => {
//   await canTakeModule(['MA2001'], [], 'MA2001').then((res) =>
//     expect(res).toBe(false)
//   )
// })
//
// it('returns false for modules doing', async () => {
//   await canTakeModule([], ['MA2001'], 'MA2001').then((res) =>
//     expect(res).toBe(false)
//   )
// })
//
// it('Rejects invalid module code', async () => {
//   await canTakeModule(['CM1102'], ['CS1010'], 'NOT_VALID').then((res) => {
//     expect(res).toBe(false)
//   })
// })
