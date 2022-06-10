import { Graph } from '@modtree/entity'
import { Create, Delete, server, t, init } from '@modtree/test-env'

beforeAll(() =>
  Promise.all([Create.User(init.user2), Create.Degree(init.degree1)])
    .then(([user, degree]) => {
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
    })
)
afterAll(() =>
  Delete.Graph(t.graphId).then(() =>
    Promise.all([Delete.User(t.userId), Delete.Degree(t.degreeId)])
  )
)

/**
 * list all graphs
 */
test('It should list all graphs', async () => {
  await server.get('graph/list').then((res) => {
    const graphs: Graph[] = res.data
    graphs.forEach((graph) => {
      expect(graph).toBeDefined()
    })
    /**
     * flatten the ids
     */
    const ids = graphs.map((u) => u.id)
    /**
     * check that the list of all ids contains the two created ids
     */
    expect(ids).toEqual(expect.arrayContaining([t.graphId]))
  })
})
