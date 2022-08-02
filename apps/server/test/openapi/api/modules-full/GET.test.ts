import { postman } from '../../../utils'

it('get many modules full', async () => {
  return postman
    .get('/modules-full', { moduleCodes: ['CS1010'] })
    .then((res) => {
      expect(res.status).toBe(200)
    })
})
