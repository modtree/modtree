import { init, postman } from '../../../../utils'

let userId: string

it('create a user', async () => {
  return postman.post('/user', init.User).then((res) => {
    expect(res.status).toBe(200)
    userId = res.data.data.id
  })
})

it('delete a user', async () => {
  return postman.delete(`/user/${userId}`).then((res) => {
    expect(res.status).toBe(200)
  })
})
