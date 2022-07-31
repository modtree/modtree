import { postman } from '../../../utils'

it('returns 200', async () => {
  const res = await postman.get('/modules', { moduleCodes: ['CS1010'] })
  expect(res.status).toBe(200)
})
