import { AxiosError } from 'axios'
import { ModtreeApiResponse } from '@modtree/types'
import { Create, Delete, server, init } from '@modtree/test-env'

const t: Partial<{
  graph: ModtreeApiResponse.Graph
  user: ModtreeApiResponse.User
  original: ModtreeApiResponse.Graph
  graphId: string
  userId: string
  degreeId: string
  freshCode: string
  hiddenCode: string
  placedCode: string
}> = {}

beforeAll(() =>
  Promise.all([Create.User(init.user2), Create.Degree(init.degree1)])
    .then(([user, degree]) => {
      t.user = user
      t.userId = user.id
      t.degreeId = degree.id
    })
    .then(() =>
      Create.Graph({
        ...init.graph1,
        userId: t.userId,
        degreeId: t.degreeId,
      })
    )
    .then((graph) => {
      t.graphId = graph.id
      t.original = graph
      t.graph = graph
    })
)
afterAll(() =>
  Delete.Graph(t.graphId).then(() =>
    Promise.all([Delete.User(t.userId), Delete.Degree(t.degreeId)])
  )
)

/**
 * server should return 400 Bad Request on invalid ids
 */
test('reject unseen graph id', async () => {
  const invalidId = 'yellow'
  await expect(() =>
    server.post(`graph/id/${invalidId}/toggle/${t.freshCode}`)
  ).rejects.toThrowError(new AxiosError('Request failed with status code 400'))
})

/**
 * unseen modules should be treated as new additions to the graph
 */
describe('insert unseen module', () => {
  /**
   * a module that isn't yet in the graph
   */
  it('should be a fresh module', () => {
    t.freshCode = 'CM1102'
    expect(t.graph.modulesPlaced).not.toContain(t.freshCode)
    expect(t.graph.modulesHidden).not.toContain(t.freshCode)
  })

  /**
   * since the module isn't in the graph,
   * toggling it should add it to the placed list.
   */
  it('places this module', async () => {
    await server
      .post(`graph/id/${t.graphId}/toggle/${t.freshCode}`)
      .then((res) => {
        const graph: ModtreeApiResponse.Graph = res.data
        expect(graph.modulesPlaced).toContain(t.freshCode)
      })
  })
})

describe('hidden -> placed', () => {
  /**
   * a module that is already in the list of modules hidden
   */
  it('is a hidden module', () => {
    t.hiddenCode = 'MA2219'
    expect(t.graph.modulesPlaced).not.toContain(t.hiddenCode)
    expect(t.graph.modulesHidden).toContain(t.hiddenCode)
  })

  /**
   * since the module isn't in the graph,
   * toggling it should add it to the placed list.
   */
  it('makes hidden -> placed', async () => {
    await server
      .post(`graph/id/${t.graphId}/toggle/${t.hiddenCode}`)
      .then((res) => {
        const graph: ModtreeApiResponse.Graph = res.data
        const { modulesPlaced, modulesHidden } = graph
        expect(modulesPlaced).toContain(t.hiddenCode)
        expect(modulesHidden).not.toContain(t.hiddenCode)
        t.graph = graph
      })
  })
})

describe('placed -> hidden', () => {
  /**
   * a module that is already in the list of modules placed
   */
  it('is a placed module', () => {
    t.placedCode = t.freshCode
    expect(t.graph.modulesPlaced).toContain(t.placedCode)
    expect(t.graph.modulesHidden).not.toContain(t.placedCode)
  })

  /**
   * toggling it should hide it
   */
  it('makes placed -> hidden', async () => {
    await server
      .post(`graph/id/${t.graphId}/toggle/${t.hiddenCode}`)
      .then((res) => {
        const graph: ModtreeApiResponse.Graph = res.data
        const { modulesPlaced, modulesHidden } = graph
        expect(modulesPlaced).not.toContain(t.hiddenCode)
        expect(modulesHidden).toContain(t.hiddenCode)
      })
  })
})
