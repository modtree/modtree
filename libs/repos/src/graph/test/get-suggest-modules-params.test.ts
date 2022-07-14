import { GraphRepository } from '@modtree/repos'
import { mocks } from '@modtree/test-env'
import { Module } from '@modtree/types'
import '@modtree/test-env/jest'

jest.mock('../../base')

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

const selected = ['CS1010S']
const correct = [
  {
    userId: 'user-1',
    degreeId: 'degree-1',
    expected: [['MA2001'], ['MA2219'], selected, ['MA2001', 'MA1100']],
  },
  {
    userId: 'user-2',
    degreeId: 'degree-1',
    expected: [['CM1102'], ['HSH1000'], selected, ['MA2001', 'MA1100']],
  },
  {
    userId: 'user-1',
    degreeId: 'degree-2',
    expected: [['MA2001'], ['MA2219'], selected, ['CM1102', 'CS1010S']],
  },
  {
    userId: 'user-2',
    degreeId: 'degree-2',
    expected: [['CM1102'], ['HSH1000'], selected, ['CM1102', 'CS1010S']],
  },
].map((e, i) => ({ ...e, index: i + 1 }))

test.each(correct)('test: $index', async ({ userId, degreeId, expected }) => {
  const graph = graphRepo.create({
    user: { id: userId },
    degree: { id: degreeId },
  })
  await graphRepo.getSuggestModulesParams(graph, selected).then((res) => {
    expect(res).toBeInstanceOf(Array)
    expect(res).toHaveLength(4)
    for (let i = 0; i < 4; i++) {
      expect(res[i]).toIncludeSameMembers(expected[i])
    }
  })
})
