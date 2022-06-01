import { container, endpoint, getSource } from '../../src/data-source'
import { Init } from '../../types/entity'
import { Degree, User, Module, Graph } from '../../src/entity'
import {
  DegreeRepository,
  UserRepository,
  GraphRepository,
} from '../../src/repository'
import { setup, importChecks, teardown } from '../environment'
import { setupGraph } from './setup'

const dbName = 'test_graph_pull_all_false'
const db = getSource(dbName)

beforeAll(async () => {
  await setup(dbName)
  const res = await setupGraph(db)
  if (!res) throw new Error('Unable to setup Graph test.')
  ;[user, degree] = res
})
afterAll(() => teardown(dbName))

importChecks({
  entities: [Module, Degree, User, Graph],
  repositories: [UserRepository(db), DegreeRepository(db), GraphRepository(db)],
})

let degree: Degree
let user: User
let graph: Graph

describe('Graph.initialize', () => {
  it('Saves a graph', async () => {
    const graphProps: Init.GraphProps = {
      userId: user.id,
      degreeId: degree.id,
      modulesPlacedCodes: [],
      modulesHiddenCodes: [],
      pullAll: false,
    }
    await container(db, () => GraphRepository(db).initialize(graphProps))
    const res = await endpoint(db, () =>
      container(db, () =>
        GraphRepository(db).findOneByUserAndDegreeId(user.id, degree.id)
      )
    )
    expect(res).toBeDefined()
    if (!res) return
    graph = res
  })

  it('modulesPlaced and modulesHidden are blank', async () => {
    expect(graph.modulesPlaced.length).toEqual(0)
    expect(graph.modulesHidden.length).toEqual(0)
  })
})
