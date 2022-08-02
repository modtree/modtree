import { init, postman } from '../../../../../utils'

let degreeId: string
let userId: string

it('create a user', async () => {
  const degree = postman.post('/degree', init.Degree)
  const user = postman.post('/user', init.User)
  return Promise.all([degree, user]).then(([degreeRes, userRes]) => {
    expect(degreeRes.status).toBe(200)
    expect(userRes.status).toBe(200)
    degreeId = degreeRes.data.data.id
    userId = userRes.data.data.id
  })
})

it('insert a degree', async () => {
  return postman
    .patch(`/user/${userId}/insert-degrees`, { degreeIds: [degreeId] })
    .then((res) => {
      expect(res.status).toBe(200)
    })
})
