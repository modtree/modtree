import '@modtree/test-env/jest'
import { UserRepository, DegreeRepository } from '@modtree/repos'
import { mocks } from '@modtree/test-env'
import { Degree, User } from '@modtree/types'

jest.mock('../../../base')
jest.mock('../../../module')
jest.mock('../../../degree')

const fakeData = {
  degree: [{ id: 'a' }, { id: 'b' }],
}

const userRepo = new UserRepository(mocks.getDb(fakeData))
const degreeRepo = new DegreeRepository(mocks.getDb(fakeData))

const error = 'Degree not in savedDegrees'
const correct = [
  { type: 'set from no degree', degreeIds: [], setMain: 'a', error },
  {
    type: 'set existing degree',
    degreeIds: ['a'],
    setMain: 'a',
    expectedId: 'a',
  },
  {
    type: 'set from outside of saved degree',
    degreeIds: ['a'],
    setMain: 'b',
    error,
  },
  {
    type: 'chooses from exisitng degree',
    degreeIds: ['b', 'a'],
    setMain: 'a',
    expectedId: 'a',
  },
]

test.each(correct)('$type', async (props) => {
  const { degreeIds, setMain, expectedId, error } = props
  /**
   * test prep: initialize degrees and user
   */
  const savedDegrees = degreeIds.map((id) => degreeRepo.create({ id }))
  const user = await userRepo.initialize('a@b').then((user) =>
    userRepo.save({
      ...user,
      savedDegrees,
      mainDegree: degreeRepo.create({ id: 'c' }),
    })
  )
  /**
   * the real test
   */
  if (!error) {
    // test for when degree id is in user
    await userRepo.setMainDegree(user, setMain).then((user) => {
      expect(user).toBeInstanceOf(User)
      expect(user.mainDegree).toBeInstanceOf(Degree)
      expect(user.mainDegree!.id).toEqual(expectedId)
    })
  } else {
    // test for when degree id is not in user
    await expect(userRepo.setMainDegree(user, setMain)).rejects.toThrowError()
  }
})
