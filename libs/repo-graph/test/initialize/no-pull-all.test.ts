import { oneUp } from '@modtree/utils'
import { getSource } from '@modtree/typeorm-config'
import { setup, teardown, Repo, t, init } from '@modtree/test-env'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() =>
  setup(db)
    .then(() =>
      Promise.all([
        Repo.User!.initialize(init.user1),
        Repo.Degree!.initialize(init.degree1),
      ])
    )
    .then(([user, degree]) => {
      t.user = user
      t.degree = degree
    })
)
afterAll(() => teardown(db))

it('no placed nor hidden', async () => {
  await Repo.Graph!.initialize({
    userId: t.user!.id,
    degreeId: t.degree!.id,
    modulesPlacedCodes: [],
    modulesHiddenCodes: [],
    pullAll: false,
  }).then((graph) => {
    expect(graph.modulesPlaced).toHaveLength(0)
    expect(graph.modulesHidden).toHaveLength(0)
  })
})
