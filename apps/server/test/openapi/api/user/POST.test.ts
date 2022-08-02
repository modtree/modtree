import { init, postman } from '../../../utils'

it('create a user', async () => {
  return postman.post('/user', init.User).then((res) => {
    expect(res.status).toBe(200)
  })
})
