import { init, postman } from '../../../utils'

it('create a degree', async () => {
  return postman.post('/degree', init.Degree).then((res) => {
    expect(res.status).toBe(200)
  })
})
