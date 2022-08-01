import { postman } from '../../../../utils'

it('returns 200', async () => {
  return postman
    .get('/search/modules-condensed', { query: 'CS1010' })
    .then((res) => {
      expect(res.status).toBe(200)
    })
})
