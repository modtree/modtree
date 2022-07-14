import { GraphRepository } from '@modtree/repos'
import { mocks } from '@modtree/test-env'
import { Degree, Graph, Module, User } from '@modtree/types'
import '@modtree/test-env/jest'

jest.mock('../../base')
jest.mock('../../graph')

const mod = (moduleCode: string): Module =>
  Object.assign(new Module(), { moduleCode })

const fakeData = {
  user: [
    {
      id: 'user-1',
      modulesDone: [mod('MA2001')],
      modulesDoing: [mod('MA2219')],
    },
    {
      id: 'user-2',
      modulesDone: [mod('CM1102')],
      modulesDoing: [mod('HSH1000')],
    },
  ],
  degree: [
    {
      id: 'degree-1',
      modules: [mod('MA2001'), mod('MA1100')],
    },
    {
      id: 'degree-2',
      modules: [mod('CM1102'), mod('CS1010S')],
    },
  ],
}

const graphRepo = new GraphRepository(mocks.getDb(fakeData))

const correct = [
  {
    type: 'hide remaining degree modules',
    title: 'anything',
    userId: 'user-1',
    degreeId: 'degree-1',
    hidden: ['MA1100'],
    placed: ['MA2219', 'MA2001'],
  },
  {
    type: 'no module overlap between user and degree',
    title: '_x*.-/\\',
    userId: 'user-2',
    degreeId: 'degree-1',
    hidden: ['MA2001', 'MA1100'],
    placed: ['HSH1000', 'CM1102'],
  },
  {
    type: 'extra test case',
    title: '.',
    userId: 'user-1',
    degreeId: 'degree-2',
    hidden: ['CM1102', 'CS1010S'],
    placed: ['MA2219', 'MA2001'],
  },
  {
    type: 'extra test case',
    title: '/',
    userId: 'user-2',
    degreeId: 'degree-2',
    hidden: ['CS1010S'],
    placed: ['HSH1000', 'CM1102'],
  },
]

beforeEach(() => jest.clearAllMocks())

test.each(correct)(
  '$type',
  async ({ title, userId, degreeId, hidden, placed }) => {
    await graphRepo.initialize({ title, userId, degreeId }).then((graph) => {
      const { modulesPlaced, modulesHidden, user, degree } = graph
      /**
       * basic data
       */
      expect(graph).toBeInstanceOf(Graph)
      expect(graph.title).toEqual(title)
      expect(user).toBeInstanceOf(User)
      expect(degree).toBeInstanceOf(Degree)
      expect(user.id).toEqual(userId)
      expect(degree.id).toEqual(degreeId)
      /**
       * modules
       */
      expect(modulesHidden.map((m) => m.moduleCode)).toIncludeSameMembers(
        hidden
      )
      expect(modulesPlaced.map((m) => m.moduleCode)).toIncludeSameMembers(
        placed
      )
      /**
       * flow props
       */
      expect(graph.flowNodes).toBeInstanceOf(Array)
      expect(graph.flowNodes).toHaveLength(modulesPlaced.length)
      expect(graph.flowEdges).toBeInstanceOf(Array)
    })
  }
)
