import { DegreeRepository, ModuleRepository } from '@modtree/repos'
import { mocks } from '@modtree/test-env'

jest.mock('../../base')
jest.mock('../../module')

const degreeRepo = new DegreeRepository(mocks.db)
const moduleRepo = new ModuleRepository(mocks.db)
const degree = degreeRepo.create({
  title: 'Test Degree',
  modules: [moduleRepo.create({ moduleCode: 'AC1000' })],
})

const correct = [
  {
    type: 'it works',
    insert: ['MA2001', 'ST2334'],
    expected: ['AC1000', 'MA2001', 'ST2334'],
  },
  {
    type: "doesn't add modules if all are invalid",
    insert: ['NOT_VALID'],
    expected: ['AC1000'],
  },
  {
    type: 'handles mix of valid/invalid modules',
    insert: ['NOT_VALID', 'CS4269'],
    expected: ['AC1000', 'CS4269'],
  },
]

test.each(correct)('$type', async ({ insert, expected }) => {
  await degreeRepo.insertModules(degree, insert).then((degree) => {
    const codes = degree.modules.map((m) => m.moduleCode)
    expect(codes).toIncludeSameMembers(expected)
  })
})
