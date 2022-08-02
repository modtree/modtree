import { init, postman } from '../../../utils'

it('login', async () => {
  return postman
    .post('/login', {
      provider: '',
      providerId: 'provider-id',
      email: init.User.email,
    })
    .then((res) => {
      expect(res.status).toBe(200)
    })
})
