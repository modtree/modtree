import { postman } from '../utils'

it('server is up', async () => {
  const res = await postman.root()
  expect(res.status).toBe(200)
  expect(res.data).toBe('modtree server is running')
})
