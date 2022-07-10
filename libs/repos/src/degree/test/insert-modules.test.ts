import { DegreeRepository, ModuleRepository } from '@modtree/repos'
import { mocks } from '@modtree/test-env'
import { Module } from '@modtree/types'
import { validModuleCode } from '@modtree/utils'

jest.mock('../../base')
jest.mock('../../module', () => {
  const actual = jest.requireActual('../../module')
  const M: typeof ModuleRepository = actual.ModuleRepository
  M.prototype.findByCodes = jest.fn(async (codes: string[]) =>
    codes
      .filter(validModuleCode)
      .map((code) => Object.assign(new Module(), { moduleCode: code }))
  )
  return { ModuleRepository: M }
})

const degreeRepo = new DegreeRepository(mocks.db)
const degree = degreeRepo.create({
  title: 'Test Degree',
  modules: [],
})

it('correctly saves modules', async () => {
  await degreeRepo
    .insertModules(degree, ['MA1521', 'MA2001', 'ST2334'])
    .then((degree) => {
      const codes = degree.modules.map((m) => m.moduleCode)
      expect(codes).toIncludeSameMembers(['MA1521', 'MA2001', 'ST2334'])
    })
})

it("doesn't add modules if all are invalid", async () => {
  await degreeRepo.insertModules(degree, ['NOT_VALID']).then((degree) => {
    const codes = degree.modules.map((m) => m.moduleCode)
    expect(codes).toIncludeSameMembers(['MA1521', 'MA2001', 'ST2334'])
  })
})

it('handles mix of valid/invalid modules', async () => {
  await degreeRepo
    .insertModules(degree, ['NOT_VALID', 'CS4269'])
    .then((degree) => {
      const codes = degree.modules.map((m) => m.moduleCode)
      expect(codes).toIncludeSameMembers([
        'MA1521',
        'MA2001',
        'ST2334',
        'CS4269',
      ])
    })
})
