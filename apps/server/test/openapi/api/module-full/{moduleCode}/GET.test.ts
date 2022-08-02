import { postman } from '../../../../utils'

it('get a module full', async () => {
  return postman.get('/module-full/CS1010').then((res) => {
    expect(res.status).toBe(200)
  })
})
