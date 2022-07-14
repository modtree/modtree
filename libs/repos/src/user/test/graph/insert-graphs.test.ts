import '@modtree/test-env/jest'
import { UserRepository, GraphRepository } from '@modtree/repos'
import { mocks } from '@modtree/test-env'
import { User } from '@modtree/types'

jest.mock('../../../base')
jest.mock('../../../module')
jest.mock('../../../graph')

const init = {
  authZeroId: 'auth0|012345678901234567890123',
  email: 'khang@modtree.com',
}

const userRepo = new UserRepository(mocks.db)
const graphRepo = new GraphRepository(mocks.db)

const correct = [
  // { graphIds: [], insert: [''], expected: [] },
  // { graphIds: ['a'], insert: [''], expected: ['a'] },
  // { graphIds: ['a'], insert: ['b'], expected: ['a'] },
  { graphIds: ['b', 'a'], insert: ['a'], expected: ['a', 'b'] },
]

test.each(correct)(
  'ids: $degreeIds, insert: $insert',
  async ({ graphIds, insert, expected }) => {
    /**
     * test prep: initialize degrees and user
     */
    const savedGraphs = graphIds.map((id) => graphRepo.create({ id }))
    const originalUser = await userRepo
      .initialize(init)
      .then((user) => userRepo.save({ ...user, savedGraphs }))
    /**
     * the real test
     */
    await userRepo.insertGraphs(originalUser, insert).then((user) => {
      expect(user).toBeInstanceOf(User)
      const savedGraphIds = user.savedGraphs.map((d) => d.id)
      expect(savedGraphIds).toIncludeSameMembers(expected)
    })
  }
)
