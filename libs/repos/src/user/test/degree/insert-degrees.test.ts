import '@modtree/test-env/jest'
import { UserRepository, DegreeRepository } from '@modtree/repos'
import { mocks } from '@modtree/test-env'
import { Degree } from '@modtree/types'

jest.mock('../../../base')
jest.mock('../../../module')

const fakeData = {
  module: {
    AX1000: { fulfillRequirements: ['AX2000', 'CX2000'] },
    BX1000: { fulfillRequirements: ['BX2000', 'CX2000'] },
    DX1000: { fulfillRequirements: [] },
    AX2000: {
      prereqTree: { and: ['AX1000', 'BX1000'] },
      fulfillRequirements: ['CX2000'],
    },
    BX2000: { prereqTree: { or: ['AX1000', 'BX1000'] } },
    CX2000: { prereqTree: { and: ['AX1000', 'AX2000'] } },
  },
}

const init = {
  authZeroId: 'auth0|012345678901234567890123',
  email: 'khang@modtree.com',
}

const userRepo = new UserRepository(mocks.getDb(fakeData))
const degreeRepo = new DegreeRepository(mocks.getDb(fakeData))

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

it('returns a user', async () => {
  // get user with all relations
  await Repo.User.insertDegrees(t.user!, [t.degree!.id]).then((user) => {
    expect(user).toBeInstanceOf(User)
    t.user = user
  })
})

it('adds correct degree id', () => {
  const degreeIds = t.user!.savedDegrees.map((d) => d.id)
  expect(degreeIds).toContain(t.degree!.id)
})
