import { init, postman } from '../../../utils'

it('returns 200', async () => {
  return postman.post('/degree', init.Degree).then((res) => {
    expect(res.status).toBe(200)
  })
})
