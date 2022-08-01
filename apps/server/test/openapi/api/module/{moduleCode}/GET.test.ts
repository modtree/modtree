import { postman } from '../../../../utils'

it('get a module', async () => {
  return postman.get('/module/CS1010').then((res) => {
    expect(res.status).toBe(200)
  })
})
