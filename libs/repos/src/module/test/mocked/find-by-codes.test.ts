import { ModuleRepository } from '@modtree/repos'
import { mocks } from '@modtree/test-env'
import '@modtree/test-env/jest'

jest.mock('../../../base')
jest.mock('../../../module')

const fakeData = {
  module: [{ moduleCode: 'MA2001' }, { moduleCode: 'CS1010' }],
}

const moduleRepo = new ModuleRepository(mocks.getDb(fakeData))

const correct = [
  {
    type: 'single code',
    input: ['CS1010'],
    expected: ['CS1010'],
  },
  {
    type: 'multiple codes',
    input: ['CS1010', 'MA2001'],
    expected: ['CS1010', 'MA2001'],
  },
  {
    type: 'no codes',
    input: [],
    expected: [],
  },
  {
    type: 'skip invalid codes',
    input: ['CS1010', 'invalid_code'],
    expected: ['CS1010'],
  },
]

test.each(correct)('$type', async ({ input, expected }) => {
  const received = await moduleRepo.findByCodes(input)
  const moduleCodes = received.map((m) => m.moduleCode)
  expect(moduleCodes).toIncludeSameMembers(expected)
})
