import { flatten, oneUp } from '@utils'
import { container, getSource } from '@src/data-source'
import { Graph } from '@entity'
import { setup, teardown, Repo, t } from '@environment'
import { init } from "@tests/init"

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() =>
  setup(db)
    .then(() =>
      Promise.all([
        Repo.User.initialize(init.user1),
        Repo.Degree.initialize(init.degree1),
      ])
    )
    .then(([user, degree]) => {
      t.user = user
      t.degree = degree
    })
)
afterAll(() => teardown(db))

describe('Graph.initialize', () => {
  it('Initializes a graph', async () => {
    expect.assertions(1)
    /**
     * initialize a test graph instance
     */
    await container(db, () =>
      Repo.Graph.initialize({
        userId: t.user.id,
        degreeId: t.degree.id,
        modulesPlacedCodes: [],
        modulesHiddenCodes: [],
        pullAll: true,
      }).then((res) => {
        expect(res).toBeInstanceOf(Graph)
        t.graph = res
      })
    )
  })

  it('Can find same graph (excluding nested relations)', async () => {
    expect.assertions(1)
    await container(db, () =>
      Repo.Graph.findOneById(t.graph.id).then((res) => {
        expect(res).toBeInstanceOf(Graph)
        // currently not strictly equal, because Graph.findOneById
        // does not load nested relations, but Graph.initialize does
        // expect(res).toStrictEqual(t.graph)
      })
    )
  })

  it('Correctly populates modulesHidden', async () => {
    /**
     * with pull all set to true, it will take modules from
     * both the degree and the user
     */
    const all = t.degree.modules.map(flatten.module)
    all.push(...t.user.modulesDone.map(flatten.module))
    all.push(...t.user.modulesDoing.map(flatten.module))
    t.moduleCodes = Array.from(new Set(all))
    /**
     * all these module codes should show up in the hidden codes
     */
    const hidden = t.graph.modulesHidden.map(flatten.module)
    expect(hidden.sort()).toStrictEqual(t.moduleCodes.sort())
    expect(t.graph.modulesPlaced.length).toEqual(0)
  })
})
