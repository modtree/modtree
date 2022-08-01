import { init, postman } from '../../../utils'

it('returns 200', async () => {
  const res = await postman.post('/degree', init.Degree)
  expect(res.status).toBe(200)
})
