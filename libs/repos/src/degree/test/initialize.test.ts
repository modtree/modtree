import { DegreeRepository, ModuleRepository } from '@modtree/repos'
import { mocks } from '@modtree/test-env'
import { Degree, Module } from '@modtree/types'

jest.mock('../../base')
jest.mock('../../module', () => {
  const actual = jest.requireActual('../../module')
  const M: typeof ModuleRepository = actual.ModuleRepository
  M.prototype.findByCodes = jest.fn(async (codes: string[]) =>
    codes.map((code) => Object.assign(new Module(), { moduleCode: code }))
  )
  return { ModuleRepository: M }
})

const degreeRepo = new DegreeRepository(mocks.db)
let degree: Degree

const props = {
  moduleCodes: ['CS1101S', 'CS1231S', 'CS2030S', 'CS2040S'],
  title: 'Test Degree',
}

it('returns a degree', async () => {
  await degreeRepo.initialize(props).then((res) => {
    expect(res).toBeInstanceOf(Degree)
    degree = res
  })
})

it('saves correct modules', async () => {
  const codes = degree.modules.map((m) => m.moduleCode)
  expect(codes).toIncludeSameMembers(props.moduleCodes)
})
