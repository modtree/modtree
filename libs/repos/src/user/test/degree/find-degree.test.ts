import '@modtree/test-env/jest'
import { UserRepository, DegreeRepository } from '@modtree/repos'
import { mocks } from '@modtree/test-env'
import { Degree } from '@modtree/types'

jest.mock('../../../base')
jest.mock('../../../module')

const init = {
  authZeroId: 'auth0|012345678901234567890123',
  email: 'khang@modtree.com',
}

const userRepo = new UserRepository(mocks.db)
const degreeRepo = new DegreeRepository(mocks.db)

const correct = [
  { degreeIds: [], query: '', expectedId: '' },
  { degreeIds: ['a'], query: '', expectedId: '' },
  { degreeIds: ['a'], query: 'b', expectedId: '' },
  { degreeIds: ['b', 'a'], query: 'a', expectedId: 'a' },
]

test.each(correct)(
  'ids: $degreeIds, query: $query',
  async ({ degreeIds, query, expectedId }) => {
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
    if (degreeIds.includes(query)) {
      // test for when degree id is in user
      await userRepo.findDegree(user, query).then((degree) => {
        expect(degree).toBeInstanceOf(Degree)
        expect(degree).toEqual(expect.objectContaining({ id: expectedId }))
      })
    } else {
      // test for when degree id is not in user
      await expect(userRepo.findDegree(user, query)).rejects.toThrowError(
        'Degree not found in User'
      )
    }
  }
)
