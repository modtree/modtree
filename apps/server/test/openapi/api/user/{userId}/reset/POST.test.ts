import { init, postman } from '../../../../../utils'

let userId: string

it('create a user', async () => {
  return postman.post('/user', init.User).then((res) => {
    expect(res.status).toBe(200)
    userId = res.data.data.id
  })
})

it('reset a user', async () => {
  return postman.post(`/user/${userId}/reset`).then((res) => {
    expect(res.status).toBe(200)
  })
})
