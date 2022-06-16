import { flatten, oneUp } from '@modtree/utils'
import { getSource } from '@modtree/typeorm-config'
import { Graph } from '@modtree/entity'
import { setup, teardown, Repo, t, init } from '@modtree/test-env'
import { GraphRepository } from '../../src'
import { DegreeRepository } from '@modtree/repo-degree'
import { UserRepository } from '@modtree/repo-user'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() =>
  setup(db)
    .then(() => {
      Repo.User = new UserRepository(db)
      Repo.Degree = new DegreeRepository(db)
      Repo.Graph = new GraphRepository(db)
      return Promise.all([
        Repo.User!.initialize({
          ...init.user1,
          modulesDone: ['MA2001'],
          modulesDoing: ['MA2219'],
        }),
        Repo.Degree!.initialize({
          moduleCodes: ['CS1101S', 'MA2001'],
          title: 'Test Degree',
        }),
      ])
    })
    .then(([user, degree]) => {
      t.user = user
      t.degree = degree
    })
)
afterAll(() => teardown(db))

it('initial count', async () => {
  await Repo.Graph!.count().then((count) => {
    expect(count).toEqual(0)
  })
})

it('returns a graph', async () => {
  await Repo.Graph!.initialize({
    userId: t.user!.id,
    degreeId: t.degree!.id,
    modulesPlacedCodes: [],
    modulesHiddenCodes: [],
    pullAll: true,
  }).then((graph) => {
    expect(graph).toBeInstanceOf(Graph)
    t.graph = graph
  })
})

it('increments the count by 1', async () => {
  await Repo.Graph!.count().then((count) => {
    expect(count).toEqual(1)
  })
})

it('saves correct hidden modules', async () => {
  const codes = t.graph!.modulesHidden.map(flatten.module)
  expect(codes).toIncludeSameMembers(['CS1101S', 'MA2001', 'MA2219'])
})

it('has no modules placed', () => {
  expect(t.graph!.modulesPlaced).toHaveLength(0)
})
