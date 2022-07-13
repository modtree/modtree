import { DegreeRepository } from '@modtree/repos'
import { mocks } from '@modtree/test-env'

jest.mock('../../../base')
jest.mock('../../../module')

const degreeRepo = new DegreeRepository(mocks.db)
const degree = degreeRepo.create({
  title: 'Test Degree',
  modules: [],
})

const correct = [
  {
    type: 'it works',
    moduleCodes: ['MA1521', 'MA2001'],
    expected: ['MA1521', 'MA2001'],
  },
  {
    type: "doesn't add modules if all are invalid",
    moduleCodes: ['NOT_VALID'],
    expected: [],
  },
  {
    type: 'handles mix of valid/invalid modules',
    moduleCodes: ['NOT_VALID', 'CS4269'],
    expected: ['CS4269'],
  },
]

test.each(correct)('$type', async ({ moduleCodes, expected }) => {
  await degreeRepo
    .modify(degree, { title: 'test', moduleCodes })
    .then((degree) => {
      const codes = degree.modules.map((m) => m.moduleCode)
      expect(codes).toIncludeSameMembers(expected)
    })
})
