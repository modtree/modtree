import { flatten } from '../../../src/utils'
import { container, endpoint, getSource } from '../../../src/data-source'
import { Degree, Graph, Module, User } from '../../../src/entity'
import {
  DegreeRepository,
  GraphRepository,
  UserRepository,
} from '../../../src/repository'
import { importChecks, setup, teardown } from '../../environment'
import { init } from '../../init'
import { setupGraph } from '../setup'

const dbName = 'test_graph_initialize'
const db = getSource(dbName)
let degree: Degree
let user: User
let graph: Graph
let moduleCodes: string[]

importChecks({
  entities: [Module, Degree, User, Graph],
  repositories: [UserRepository(db), DegreeRepository(db), GraphRepository(db)],
})

beforeAll(() =>
  setup(dbName)
    .then(() => setupGraph(db))
    .then((res) => {
      user = res.user
      degree = res.degree
    })
    .catch(() => {
      throw new Error('Unable to setup Graph test.')
    })
)
afterAll(() => teardown(dbName))

describe('Graph.initialize', () => {
  it('Initializes a graph', async () => {
    expect.assertions(1)
    /**
     * initialize a test graph instance
     */
    await container(db, () =>
      GraphRepository(db)
        .initialize({
          userId: user.id,
          degreeId: degree.id,
          modulesPlacedCodes: [],
          modulesHiddenCodes: [],
          pullAll: true,
        })
        .then((res) => {
          expect(res).toBeInstanceOf(Graph)
          graph = res
        })
    )
  })

  it('Correctly populates modulesHidden', async () => {
    /**
     * with pull all set to true, it will take modules from
     * both the degree and the user
     */
    const all = degree.modules.map(flatten.module)
    all.push(...user.modulesDone.map(flatten.module))
    all.push(...user.modulesDoing.map(flatten.module))
    moduleCodes = Array.from(new Set(all))
    /**
     * all these module codes should show up in the hidden codes
     */
    const hidden = graph.modulesHidden.map(flatten.module)
    expect(hidden.sort()).toEqual(moduleCodes.sort())
    expect(graph.modulesPlaced.length).toEqual(0)
  })
})

describe('Graph.toggleModules', () => {
  it("Correctly changes a module's state from placed to hidden", async () => {
    const toggled = 'MA2001'
    /**
     * execute the toggle
     */
    await container(db, () => GraphRepository(db).toggleModule(graph, toggled))
    /**
     * hidden list should have one less module
     */
    expect(graph.modulesHidden.length).toEqual(moduleCodes.length - 1)
    /**
     * placed list should now have one module
     */
    expect(graph.modulesPlaced.length).toEqual(1)
    /**
     * that single module placed should be the toggled module
     */
    expect(graph.modulesPlaced[0].moduleCode).toEqual(toggled)
  })

  it("Correctly changes a module's state from hidden to placed", async () => {
    /**
     * simple the inverse of the above
     */
    await container(db, () => GraphRepository(db).toggleModule(graph, 'MA2001'))
    expect(graph.modulesHidden.length).toEqual(moduleCodes.length)
    expect(graph.modulesPlaced.length).toEqual(0)
  })

  it('Throws error if the module toggled neither hidden nor placed', async () => {
    /**
     * this expects 2 assertions to be made
     * if the container doesn't go into catch, no assertions will be made
     * and so this test will fail
     */
    expect.assertions(2)
    /**
     * the actual error test
     */
    await endpoint(db, () =>
      container(db, () =>
        GraphRepository(db).toggleModule(graph, init.invalidModuleCode)
      ).catch((err) => {
        /**
         * the two assertions that are expected to required to run
         */
        expect(err).toBeInstanceOf(Error)
        expect(err.message).toBe('Module not found in Graph')
      })
    )
  })
})
