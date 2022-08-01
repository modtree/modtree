import { postman } from '../../../utils'

it('get many modules', async () => {
  return postman.get('/modules', { moduleCodes: ['CS1010'] }).then((res) => {
    expect(res.status).toBe(200)
  })
})
