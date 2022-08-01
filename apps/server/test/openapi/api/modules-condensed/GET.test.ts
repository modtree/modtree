import { postman } from '../../../utils'

it('get many modules condensed', async () => {
  return postman
    .get('/modules-condensed', { moduleCodes: ['CS1010'] })
    .then((res) => {
      expect(res.status).toBe(200)
    })
})
