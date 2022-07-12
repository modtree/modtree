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
  { degreeIds: [], remove: 'a', expected: [] },
  { degreeIds: ['a'], remove: 'a', expected: [] },
  { degreeIds: ['a'], remove: 'b', expected: [] },
  { degreeIds: ['b', 'a'], remove: 'a', expected: ['b'] },
]

test.each(correct)(
  'ids: $degreeIds, query: $query',
  async ({ degreeIds, remove, expected }) => {
    /**
     * test prep: initialize degrees and user
     */
    const savedDegrees = degreeIds.map((id) => degreeRepo.create({ id }))
    const user = await userRepo
      .initialize(init)
      .then((user) => userRepo.save({ ...user, savedDegrees }))
    /** pre-check */
    expect(user.savedDegrees.map((d) => d.id)).toIncludeSameMembers(degreeIds)
    /**
     * the real test
     */
    if (degreeIds.includes(remove)) {
      // removing a degree that the user has
      await userRepo.removeDegree(user, remove).then((user) => {
        expect(user).toBeInstanceOf(User)
        expect(user.savedDegrees.map((d) => d.id)).toIncludeSameMembers(
          expected
        )
      })
    } else {
      // removing a degree that the user doesn't have
      await expect(userRepo.removeDegree(user, remove)).rejects.toThrowError(
        'Degree not found in User'
      )
    }
  }
)
