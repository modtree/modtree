import { postman } from '../../../../utils'

it('search modules condensed', async () => {
  return postman
    .get('/search/modules-condensed', { query: 'CS1010' })
    .then((res) => {
      expect(res.status).toBe(200)
    })
})
