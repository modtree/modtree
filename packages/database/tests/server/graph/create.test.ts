import { AxiosError } from 'axios'
import { Graph } from '@entity'
import { Create, Delete, server, t } from '@environment'
import { init } from '@tests/init'

beforeAll(() =>
  Promise.all([Create.User(init.user2), Create.Degree(init.degree1)]).then(
    ([user, degree]) => {
      t.userId = user.id
      t.degreeId = degree.id
    }
  )
)
afterAll(() =>
  Delete.Graph(t.graphId).then(() =>
    Promise.all([Delete.User(t.userId), Delete.Degree(t.degreeId)])
  )
)

/**
 * create a graph
 */
test('It should create a graph', async () => {
  await server
    .post('graph/create', {
      ...init.graph1,
      userId: t.userId,
      degreeId: t.degreeId,
    })
    .then((res) => {
      const graph: Graph = res.data
      expect(typeof graph.id).toBe('string')
      expect(graph.id.length).toBeGreaterThan(0)
      t.graphId = graph.id
    })
})

/**
 * reject a graph creation if has insufficient keys
 * with status 400: Bad Request
 */
test('It should reject a graph creation on insufficient keys', async () => {
  await expect(() =>
    server.post('graph/create', {
      ...init.graph1,
      moduleCodes: undefined,
    })
  ).rejects.toThrowError(new AxiosError('Request failed with status code 400'))
})
