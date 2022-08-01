import { postman } from '../../../../utils'

it('returns 200', async () => {
  const res = await postman.get('/module/CS1010')
  expect(res.status).toBe(200)
})
