import { ModuleRepository } from '@modtree/repos'
import { mocks } from '@modtree/test-env'
import '@modtree/test-env/jest'
import { Module } from '@modtree/types'

const database: Record<string, Partial<Module>> = {
  CS1010: {
    fulfillRequirements: [
      'CP2106',
      'CS1020',
      'CS2030',
      'CS2030S',
      'CS2040',
      'CS2040C',
      'CS2040S',
      'CS2100',
      'CS2107',
      'CS3237',
      'DSA3102',
      'MA3269',
    ],
  },
  MA2001: {
    fulfillRequirements: [
      'MA2101',
      'MA2101S',
      'MA2213',
      'MA2214',
      'MA2219',
      'MA2288',
      'MA3220',
      'MA3252',
      'MA3238',
      'MA2289',
    ],
  },
}

jest.mock('../../base')
jest.mock('../repo', () => {
  const M = jest.requireActual('../repo')
  const R: typeof ModuleRepository = M.ModuleRepository
  R.prototype.findByCodes = async (codes: string[]) => {
    return codes.map((code) => Object.assign(new Module(), database[code]))
  }
  return { ModuleRepository: R }
})

const moduleRepo = new ModuleRepository(mocks.db)

it('returns an array', async () => {
  await moduleRepo.getPostReqs(['MA2001']).then((res) => {
    expect(res).toBeInstanceOf(Array)
  })
})

// describe('single query', () => {
//
//   it('returns correct modules', async () => {
//     await Repo.Module.findOneByOrFail({
//       moduleCode: 'MA2001',
//     }).then((module) => {
//       expect(t.postReqsCodes).toIncludeSameMembers(module.fulfillRequirements)
//     })
//   })
// })
//
// describe('multi query', () => {
//   it('returns an array', async () => {
//     await Repo.Module.getPostReqs(['MA2001', 'CS1010S']).then((res) => {
//       expect(res).toBeInstanceOf(Array)
//       t.postReqsCodes = res
//     })
//   })
//
//   it('returns correct modules', async () => {
//     const codes: string[] = []
//     await Repo.Module.findBy({
//       moduleCode: In(['MA2001', 'CS1010S']),
//     }).then((modules) => {
//       modules.forEach((module) => {
//         codes.push(...module.fulfillRequirements)
//       })
//     })
//     expect(t.postReqsCodes).toIncludeSameMembers(unique(codes))
//   })
// })
//
// it('returns [] for modules with no post reqs', async () => {
//   await Repo.Module.getPostReqs(['CP2106']).then((res) => {
//     expect(res).toStrictEqual([])
//   })
// })
