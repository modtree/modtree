import { postman } from '../../../utils'

it('returns 200', async () => {
  const res = await postman.post('/degree', {
    title: 'Test Degree',
    moduleCodes: ['CS1010', 'MA2001'],
  })
  expect(res.status).toBe(200)
})
