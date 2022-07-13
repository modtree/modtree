import '@modtree/test-env/jest'
import { UserRepository, GraphRepository } from '@modtree/repos'
import { mocks } from '@modtree/test-env'
import { Graph, User, Degree } from '@modtree/types'

jest.mock('../../../base')
jest.mock('../../../module')
// jest.mock('../../../degree')
jest.mock('../../../graph')

const init = {
  authZeroId: 'auth0|012345678901234567890123',
  email: 'khang@modtree.com',
}

const fakeData = {
  graph: [
    { id: 'a', degree: { id: 'x' } as Degree },
    { id: 'b', degree: { id: 'y' } as Degree },
  ],
  degree: [{ id: 'x' }, { id: 'y' }, { id: 'z' }],
}

const userRepo = new UserRepository(mocks.getDb(fakeData))
const graphRepo = new GraphRepository(mocks.getDb(fakeData))

const correct = [
  {
    graphIds: ['a', 'b'],
    savedDegrees: ['x'],
    setMain: 'a',
    expectedId: 'a',
  },
  {
    graphIds: ['a', 'b'],
    savedDegrees: ['y'],
    setMain: 'a',
    expectedError: "Graph's degree not in savedDegrees",
  },
]

test.each(correct)('ids: $graphIds, set main: $setMain', async (props) => {
  const { graphIds, setMain, expectedId, savedDegrees, expectedError } = props
  /**
   * test prep: initialize degrees and user
   */
  const savedGraphs = graphIds.map((id) => graphRepo.create({ id }))
  const user = await userRepo.initialize(init).then((user) =>
    userRepo.save({
      ...user,
      savedGraphs,
      savedDegrees: savedDegrees.map((id) => ({ id })),
    })
  )
  /**
   * the real test
   */
  if (expectedError) {
    // graph id not inside saved graphs
    await expect(userRepo.setMainGraph(user, setMain)).rejects.toThrowError(
      expectedError
    )
  } else {
    // graph id inside saved graphs
    await userRepo.setMainGraph(user, setMain).then((user) => {
      expect(user).toBeInstanceOf(User)
      expect(user.mainGraph).toBeInstanceOf(Graph)
      expect(user.mainGraph!.id).toEqual(expectedId)
    })
  }
})

/** saved degree */
// describe('Saved graph with saved degree', () => {
//   it('returns a user', async () => {
//     // get user with all relations
//     await Repo.User.setMainGraph(t.user!, saved.id).then((user) => {
//       expect(user).toBeInstanceOf(User)
//       t.user = user
//     })
//   })
//
//   it('sets correct main graph', () => {
//     const graphId = t.user!.mainGraph!.id
//     expect(graphId).toEqual(saved.id)
//   })
// })
//
// describe('Unsaved graph with saved degree', () => {
//   beforeEach(expect.hasAssertions)
//
//   it('throws an error', async () => {
//     await expect(() =>
//       Repo.User.setMainGraph(t.user!, unsaved.id)
//     ).rejects.toThrow(Error('Graph not in savedGraphs'))
//   })
// })

/** unsaved */
// describe('Saved graph with unsaved degree', () => {
//   beforeEach(expect.hasAssertions)
//
//   it('throws an error', async () => {
//     await expect(() =>
//       Repo.User.setMainGraph(t.user!, saved.id)
//     ).rejects.toThrow(Error("Graph's degree not in savedDegrees"))
//   })
// })
//
// describe('Unsaved graph with unsaved degree', () => {
//   beforeEach(expect.hasAssertions)
//
//   it('throws an error', async () => {
//     await expect(() =>
//       Repo.User.setMainGraph(t.user!, unsaved.id)
//     ).rejects.toThrow(Error('Graph not in savedGraphs'))
//   })
// })
