import { postman } from '../../../../utils'

it('search modules', async () => {
  return postman.get('/search/modules', { query: 'CS1010' }).then((res) => {
    expect(res.status).toBe(200)
  })
})
