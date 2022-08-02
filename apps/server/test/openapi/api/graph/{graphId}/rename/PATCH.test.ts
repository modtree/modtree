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

it('rename a graph', async () => {
  return postman
    .patch(`/graph/${graphId}/rename`, { title: 'New Title' })
    .then((res) => {
      expect(res.status).toBe(200)
    })
})
