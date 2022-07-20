import { GraphRepository } from '@modtree/repos'
import { mocks } from '@modtree/test-env'
import { Module } from '@modtree/types'
import '@modtree/test-env/jest'

jest.mock('../../base')
jest.mock('../../module')

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
// let graph: Graph

const correct = [
  {
    type: 'from hidden to placed',
    userId: 'user-1',
    degreeId: 'degree-1',
    toggle: 'MA1100',
    expectedHidden: [],
    expectedPlaced: ['MA2219', 'MA2001', 'MA1100'],
  },
  {
    type: 'from placed to hidden',
    userId: 'user-2',
    degreeId: 'degree-1',
    toggle: 'HSH1000',
    expectedHidden: ['MA2001', 'MA1100', 'HSH1000'],
    expectedPlaced: ['CM1102'],
  },
  {
    type: 'from void to placed',
    userId: 'user-2',
    degreeId: 'degree-1',
    toggle: 'HSI1000',
    expectedHidden: ['MA2001', 'MA1100'],
    expectedPlaced: ['HSH1000', 'CM1102', 'HSI1000'],
  },
  {
    type: 'invalid module code',
    userId: 'user-1',
    degreeId: 'degree-1',
    toggle: 'CS420BZT',
    expectedHidden: ['MA1100'],
    expectedPlaced: ['MA2219', 'MA2001'],
    error: 'invalid moulde code',
  },
].map((e, i) => ({ ...e, index: i + 1 }))

test.each(correct)(
  '$type',
  async ({
    userId,
    degreeId,
    toggle,
    expectedHidden,
    expectedPlaced,
    error,
  }) => {
    const graph = await graphRepo.initialize('test', userId, degreeId)
    if (!error) {
      await graphRepo.toggleModule(graph, toggle).then((graph) => {
        const { modulesHidden, modulesPlaced } = graph
        const hidden = modulesHidden.map((m) => m.moduleCode)
        const placed = modulesPlaced.map((m) => m.moduleCode)
        expect(hidden).toIncludeSameMembers(expectedHidden)
        expect(placed).toIncludeSameMembers(expectedPlaced)
      })
    } else {
      await expect(graphRepo.toggleModule(graph, toggle)).rejects.toThrowError(
        error
      )
    }
  }
)
