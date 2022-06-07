import { ResponseProps } from '../../../types/api-response'
import { init } from '../../init'
import { Create, Delete, server } from '../environment'

const t: Partial<{
  graph: ResponseProps['Graph']
  user: ResponseProps['User']
  graphId: string
  userId: string
  degreeId: string
  freshCode: string
  hiddenCode: string
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
      t.graph = graph
    })
)
afterAll(() =>
  Delete.Graph(t.graphId).then(() =>
    Promise.all([Delete.User(t.userId), Delete.Degree(t.degreeId)])
  )
)

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
  it('should place this module down', async () => {
    expect.assertions(1)
    await server.post(`graph/id/${t.graphId}/toggle/${t.freshCode}`).then((res) => {
      const graph: ResponseProps['Graph'] = res.data.graph
      expect(graph.modulesPlaced).toStrictEqual([t.freshCode])
    })
  })
})

describe('toggle existing hidden', () => {

  /**
   * a module that is already in the list of modules hidden
   */
  it('should be a hidden module', () => {
    t.hiddenCode = 'MA2219'
    expect(t.graph.modulesPlaced).not.toContain(t.hiddenCode)
    expect(t.graph.modulesHidden).toContain(t.hiddenCode)
  })

  /**
   * since the module isn't in the graph,
   * toggling it should add it to the placed list.
   */
  it('should make the hidden module placed', async () => {
    expect.assertions(1)
    await server.post(`graph/id/${t.graphId}/toggle/${t.hiddenCode}`).then((res) => {
      const graph: ResponseProps['Graph'] = res.data.graph
      expect(graph.modulesPlaced.sort()).toStrictEqual([t.hiddenCode, t.freshCode].sort())
    })
  })
})
