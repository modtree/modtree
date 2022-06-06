import { copy, Flatten, oneUp } from '../../../src/utils'
import { container, getSource } from '../../../src/data-source'
import { Degree, Graph, User } from '../../../src/entity'
import { repo, setup, teardown } from '../../environment'
import Init from '../../init'

const dbName = oneUp(__filename)
const db = getSource(dbName)
const t: Partial<{
  degree: Degree
  user: User
  graph: Graph
  moduleCodes: string[]
}> = {}

beforeAll(() =>
  setup(db)
    .then((res) => copy(res, repo))
    .then(() =>
      Promise.all([
        repo.User.initialize(Init.user1),
        repo.Degree.initialize(Init.degree1),
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
      repo.Graph.initialize({
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

  it('Correctly populates modulesHidden', async () => {
    /**
     * with pull all set to true, it will take modules from
     * both the degree and the user
     */
    const all = t.degree.modules.map(Flatten.module)
    all.push(...t.user.modulesDone.map(Flatten.module))
    all.push(...t.user.modulesDoing.map(Flatten.module))
    t.moduleCodes = Array.from(new Set(all))
    /**
     * all these module codes should show up in the hidden codes
     */
    const hidden = t.graph.modulesHidden.map(Flatten.module)
    expect(hidden.sort()).toStrictEqual(t.moduleCodes.sort())
    expect(t.graph.modulesPlaced.length).toEqual(0)
  })
})

describe('Graph.toggleModules', () => {
  it("Correctly changes a module's state from placed to hidden", async () => {
    const toggled = 'MA2001'
    /**
     * execute the toggle
     */
    await container(db, () => repo.Graph.toggleModule(t.graph, toggled))
    /**
     * hidden list should have one less module
     */
    expect(t.graph.modulesHidden.length).toEqual(t.moduleCodes.length - 1)
    /**
     * placed list should now have one module
     */
    expect(t.graph.modulesPlaced.length).toEqual(1)
    /**
     * that single module placed should be the toggled module
     */
    expect(t.graph.modulesPlaced[0].moduleCode).toEqual(toggled)
  })

  it("Correctly changes a module's state from hidden to placed", async () => {
    /**
     * simple the inverse of the above
     */
    await container(db, () => repo.Graph.toggleModule(t.graph, 'MA2001'))
    expect(t.graph.modulesHidden.length).toEqual(t.moduleCodes.length)
    expect(t.graph.modulesPlaced.length).toEqual(0)
  })

  it('Throws error if the module toggled neither hidden nor placed', async () => {
    expect.assertions(1)
    await container(db, () =>
      expect(() =>
        repo.Graph.toggleModule(t.graph, Init.invalidModuleCode)
      ).rejects.toThrowError(Error('Module not found in Graph'))
    )
  })
})
