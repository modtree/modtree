import { init, postman } from '../../../utils'

it('create a user', async () => {
  return postman.post('/user', init.User).then((res) => {
    expect(res.status).toBe(200)
  })
})

it('get a user', async () => {
  return postman
    .get('/user-by-email', { email: init.User.email })
    .then((res) => {
      expect(res.status).toBe(200)
    })
})
