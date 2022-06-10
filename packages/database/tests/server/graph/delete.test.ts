import { AxiosError } from 'axios'
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
afterAll(() => Promise.all([Delete.User(t.userId), Delete.Degree(t.degreeId)]))

/**
 * delete created graph
 */
test('It should delete created graph', async () => {
  await server.delete(`graph/delete/${t.graphId}`).then((res) => {
    expect(res.data).toMatchObject({ deleteResult: { raw: [], affected: 1 } })
  })
})

/**
 * reject graph deletion if has invalid id
 * with status 404: User not found
 */
test('It should reject bad id for deletion', async () => {
  await expect(() =>
    server.delete('graph/delete/invalid')
  ).rejects.toThrowError(new AxiosError('Request failed with status code 404'))
})
