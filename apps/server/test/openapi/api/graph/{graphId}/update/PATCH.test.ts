import { init, postman } from '../../../../../utils'

let graphId: string

it('create a graph', async () => {
  const degree = postman.post('/degree', init.Degree)
  const user = postman.post('/user', init.User)
  return Promise.all([degree, user])
    .then(([degreeRes, userRes]) => {
      return [degreeRes.data.data.id, userRes.data.data.id]
    })
    .then(([degreeId, userId]) =>
      postman.post('/graph', {
        ...init.Graph,
        userId,
        degreeId,
      })
    )
    .then((res) => {
      expect(res.status).toBe(200)
      graphId = res.data.data.id
    })
})

it('update a graph', async () => {
  return (
    postman
      /** get the graph */
      .get(`/graph/${graphId}`)
      .then((res) => {
        return res.data.data
      })
      /** add CS1010 to modules placed */
      .then((graph) => {
        graph.modulesPlaced = ['CS1010']
        return postman.patch(`/graph/${graphId}/update`, { graph })
      })
      .then((res) => {
        expect(res.status).toBe(200)
      })
  )
})
