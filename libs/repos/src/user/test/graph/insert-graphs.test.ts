import '@modtree/test-env/jest'
import { UserRepository, GraphRepository } from '@modtree/repos'
import { mocks } from '@modtree/test-env'
import { User } from '@modtree/types'

jest.mock('../../../base')
jest.mock('../../../module')
jest.mock('../../../graph')

const userRepo = new UserRepository(
  mocks.getDb({ graph: [{ id: 'a' }, { id: 'b' }] })
)
const graphRepo = new GraphRepository(mocks.db)

const correct = [
  { type: 'non-existent id', graphIds: ['a'], insert: [''], expected: ['a'] },
  { type: 'new insert', graphIds: ['a'], insert: ['b'], expected: ['a', 'b'] },
  // mocks don't work when inserting same graph twice.
]

test.each(correct)('$type', async ({ graphIds, insert, expected }) => {
  /**
   * test prep: initialize graphs and user
   */
  const savedGraphs = graphIds.map((id) => graphRepo.create({ id }))
  const originalUser = await userRepo
    .initialize2('a@b', 'google', 'id')
    .then((user) => userRepo.save({ ...user, savedGraphs }))
  /**
   * the real test
   */
  await userRepo.insertGraphs(originalUser, insert).then((user) => {
    expect(user).toBeInstanceOf(User)
    const savedGraphIds = user.savedGraphs.map((d) => d.id)
    expect(savedGraphIds).toIncludeSameMembers(expected)
  })
})
