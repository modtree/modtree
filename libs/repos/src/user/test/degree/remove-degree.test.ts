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

const error = 'Degree not found in User'
const correct = [
  { type: 'already no degrees', degreeIds: [], remove: 'a', error },
  { type: 'remove non-existent degree', degreeIds: ['a'], remove: 'b', error },
  { type: 'removes only degree', degreeIds: ['a'], remove: 'a', expected: [] },
  {
    type: 'removes a degree',
    degreeIds: ['b', 'a'],
    remove: 'a',
    expected: ['b'],
  },
]

test.each(correct)('$type', async ({ degreeIds, remove, expected, error }) => {
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
  if (!error && expected) {
    // removing a degree that the user has
    await userRepo.removeDegree(user, remove).then((user) => {
      expect(user).toBeInstanceOf(User)
      expect(user.savedDegrees.map((d) => d.id)).toIncludeSameMembers(expected)
    })
  } else {
    // removing a degree that the user doesn't have
    await expect(userRepo.removeDegree(user, remove)).rejects.toThrowError(
      error
    )
  }
})
