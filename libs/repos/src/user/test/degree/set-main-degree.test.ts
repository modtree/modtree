import '@modtree/test-env/jest'
import { UserRepository, DegreeRepository } from '@modtree/repos'
import { mocks } from '@modtree/test-env'
import { Degree, User } from '@modtree/types'

jest.mock('../../../base')
jest.mock('../../../module')
jest.mock('../../../degree')

const init = {
  authZeroId: 'auth0|012345678901234567890123',
  email: 'khang@modtree.com',
}

const fakeData = {
  degree: [{ id: 'a' }, { id: 'b' }],
}

const userRepo = new UserRepository(mocks.getDb(fakeData))
const degreeRepo = new DegreeRepository(mocks.getDb(fakeData))

const correct = [
  { degreeIds: [], setMain: 'a', expectedId: '' },
  { degreeIds: ['a'], setMain: 'a', expectedId: 'a' },
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
      expect(user.mainDegree).toBeInstanceOf(Degree)
      expect(user.mainDegree!.id).toEqual(expectedId)
    })
  } else {
    // test for when degree id is not in user
    await expect(userRepo.setMainDegree(user, setMain)).rejects.toThrowError(
      'Degree not in savedDegrees'
    )
  }
})
