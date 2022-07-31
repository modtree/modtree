import axios from 'axios'

it('server is up', async () => {
  const res = await axios.get('http://localhost:8080/')
  expect(res.status).toBe(200)
  expect(res.data).toBe('modtree server is running')
})
