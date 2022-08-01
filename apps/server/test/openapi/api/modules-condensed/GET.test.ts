import { postman } from '../../../utils'

it('returns 200', async () => {
  const res = await postman.get('/modules-condensed', {
    moduleCodes: ['CS1010'],
  })
  expect(res.status).toBe(200)
})
