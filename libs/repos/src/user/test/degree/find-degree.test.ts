import '@modtree/test-env/jest'
import { UserRepository, DegreeRepository } from '@modtree/repos'
import { mocks } from '@modtree/test-env'
import { Degree } from '@modtree/types'

jest.mock('../../../base')
jest.mock('../../../module')

const userRepo = new UserRepository(mocks.db)
const degreeRepo = new DegreeRepository(mocks.db)

const error = 'Degree not found in User'

const correct = [
  { type: 'empty query', degreeIds: ['a'], query: '', error },
  { type: 'degree not saved', degreeIds: ['a'], query: 'b', error },
  { type: 'degree saved', degreeIds: ['b', 'a'], query: 'a', expectedId: 'a' },
]

test.each(correct)('$type', async ({ degreeIds, query, expectedId, error }) => {
  /**
   * test prep: initialize degrees and user
   */
  const savedDegrees = degreeIds.map((id) => degreeRepo.create({ id }))
  const user = await userRepo
    .initialize2('khang@modtree.com', 'google', 'google-id')
    .then((user) => userRepo.save({ ...user, savedDegrees }))
  /**
   * the real test
   */
  if (!error) {
    // test for when degree id is in user
    await userRepo.findDegree(user, query).then((degree) => {
      expect(degree).toBeInstanceOf(Degree)
      expect(degree).toEqual(expect.objectContaining({ id: expectedId }))
    })
  } else {
    // test for when degree id is not in user
    await expect(userRepo.findDegree(user, query)).rejects.toThrowError(error)
  }
})
