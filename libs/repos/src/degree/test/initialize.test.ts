import { DegreeRepository } from '@modtree/repos'
import { mocks } from '@modtree/test-env'
import { Degree } from '@modtree/types'

jest.mock('../../base')
jest.mock('../../module')

const degreeRepo = new DegreeRepository(mocks.db)
let degree: Degree

it('returns a degree', async () => {
  await degreeRepo
    .initialize('Test Degree', ['CS1101S', 'CS1231S', 'CS2030S', 'CS2040S'])
    .then((res) => {
      expect(res).toBeInstanceOf(Degree)
      degree = res
    })
})

it('saves correct modules', async () => {
  const codes = degree.modules.map((m) => m.moduleCode)
  expect(codes).toIncludeSameMembers([
    'CS1101S',
    'CS1231S',
    'CS2030S',
    'CS2040S',
  ])
})
