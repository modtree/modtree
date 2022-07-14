import '@modtree/test-env/jest'
import { UserRepository, GraphRepository } from '@modtree/repos'
import { mocks } from '@modtree/test-env'
import { Graph, User, Degree } from '@modtree/types'

jest.mock('../../../base')
jest.mock('../../../module')
jest.mock('../../../graph')

const init = {
  authZeroId: 'auth0|012345678901234567890123',
  email: 'khang@modtree.com',
}

const fakeData = {
  graph: [
    { id: 'graph-a', degree: { id: 'degree-a' } as Degree },
    { id: 'graph-b', degree: { id: 'degree-b' } as Degree },
  ],
  degree: [{ id: 'degree-a' }, { id: 'degree-b' }],
}

const userRepo = new UserRepository(mocks.getDb(fakeData))
const graphRepo = new GraphRepository(mocks.getDb(fakeData))

const correct = [
  {
    type: 'change main graph',
    graphIds: ['graph-a', 'graph-b'],
    savedDegrees: ['degree-a', 'degree-b'],
    setMain: 'graph-b',
    expectedId: 'graph-b',
  },
  {
    type: 'graph not in saved graphs',
    graphIds: ['graph-a'],
    savedDegrees: ['degree-a'],
    setMain: 'graph-b',
    expectedError: 'Graph not in savedGraphs',
  },
]

test.each(correct)('$type', async (props) => {
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
      mainGraph: graphRepo.create({ id: 'graph-a' }),
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
