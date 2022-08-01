import { init, postman } from '../../../utils'

it('returns 200', async () => {
  return postman.post('/user', init.User).then((res) => {
    expect(res.status).toBe(200)
  })
})
