import '@modtree/test-env/jest'
import { UserRepository, DegreeRepository } from '@modtree/repos'
import { mocks } from '@modtree/test-env'
import { User } from '@modtree/types'

jest.mock('../../../base')
jest.mock('../../../module')

const init = {
  authZeroId: 'auth0|012345678901234567890123',
  email: 'khang@modtree.com',
}

const userRepo = new UserRepository(mocks.db)
const degreeRepo = new DegreeRepository(mocks.db)

const correct = [
  { degreeIds: [], insert: [''], expected: [] },
  { degreeIds: ['a'], insert: [''], expected: ['a'] },
  { degreeIds: ['a'], insert: ['b'], expected: ['a'] },
  { degreeIds: ['b', 'a'], insert: ['a'], expected: ['a', 'b'] },
]

test.each(correct)(
  'ids: $degreeIds, insert: $insert',
  async ({ degreeIds, insert, expected }) => {
    /**
     * test prep: initialize degrees and user
     */
    const savedDegrees = degreeIds.map((id) => degreeRepo.create({ id }))
    const originalUser = await userRepo
      .initialize(init)
      .then((user) => userRepo.save({ ...user, savedDegrees }))
    /**
     * the real test
     */
    await userRepo.insertDegrees(originalUser, insert).then((user) => {
      expect(user).toBeInstanceOf(User)
      const savedDegreeIds = user.savedDegrees.map((d) => d.id)
      expect(savedDegreeIds).toIncludeSameMembers(expected)
    })
  }
)
