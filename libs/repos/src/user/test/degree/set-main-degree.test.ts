import '@modtree/test-env/jest'
import { UserRepository, DegreeRepository } from '@modtree/repos'
import { mocks } from '@modtree/test-env'
import { Degree, User } from '@modtree/types'

jest.mock('../../../base')
jest.mock('../../../module')

const init = {
  authZeroId: 'auth0|012345678901234567890123',
  email: 'khang@modtree.com',
}

const userRepo = new UserRepository(mocks.db)
const degreeRepo = new DegreeRepository(mocks.db)

const correct = [
  { degreeIds: [], setMain: '', expectedId: '' },
  { degreeIds: ['a'], setMain: '', expectedId: '' },
  { degreeIds: ['a'], setMain: 'b', expectedId: '' },
  { degreeIds: ['b', 'a'], setMain: 'a', expectedId: 'a' },
]

test.each(correct)('ids: $degreeIds, set main: $setMain', async (props) => {
  const { degreeIds, setMain, expectedId } = props
  /**
   * test prep: initialize degrees and user
   */
  const savedDegrees = degreeIds.map((id) => degreeRepo.create({ id }))
  const user = await userRepo
    .initialize(init)
    .then((user) => userRepo.save({ ...user, savedDegrees }))
  /**
   * the real test
   */
  if (degreeIds.includes(setMain)) {
    // test for when degree id is in user
    await userRepo.setMainDegree(user, setMain).then((user) => {
      expect(user).toBeInstanceOf(User)
      expect(user.mainDegree).toEqual(
        expect.objectContaining({ id: expectedId })
      )
    })
  } else {
    // test for when degree id is not in user
    await expect(userRepo.setMainDegree(user, setMain)).rejects.toThrowError(
      'Degree not in savedDegrees'
    )
  }
})

// describe('Saved degree', () => {
//   beforeEach(expect.hasAssertions)
//
//   it('returns a user', async () => {
//     // get user with all relations
//     await Repo.User.setMainDegree(t.user!, saved.id).then((user) => {
//       expect(user).toBeInstanceOf(User)
//       t.user = user
//     })
//   })
//
//   it('sets correct main degree', () => {
//     const degreeId = t.user!.mainDegree!.id
//     expect(degreeId).toEqual(saved.id)
//   })
// })
//
// describe('Unsaved degree', () => {
//   beforeEach(expect.hasAssertions)
//
//   it('throws an error', async () => {
//     await expect(() =>
//       Repo.User.setMainDegree(t.user!, unsaved.id)
//     ).rejects.toThrow(Error('Degree not in savedDegrees'))
//   })
// })
