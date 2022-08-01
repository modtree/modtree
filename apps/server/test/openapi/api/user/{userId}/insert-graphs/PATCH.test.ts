import { init, postman } from '../../../../../utils'

let graphId: string
let degreeId: string
let userId: string

it('create a graph', async () => {
  const degree = postman.post('/degree', init.Degree)
  const user = postman.post('/user', init.User)
  return Promise.all([degree, user])
    .then(([degreeRes, userRes]) => {
      degreeId = degreeRes.data.data.id
      userId = userRes.data.data.id
      return [degreeId, userId]
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

it('insert a degree', async () => {
  return postman
    .patch(`/user/${userId}/insert-degrees`, { degreeIds: [degreeId] })
    .then((res) => {
      expect(res.status).toBe(200)
    })
})

it('insert a graph', async () => {
  return postman
    .patch(`/user/${userId}/insert-graphs`, { graphIds: [graphId] })
    .then((res) => {
      expect(res.status).toBe(200)
    })
})
