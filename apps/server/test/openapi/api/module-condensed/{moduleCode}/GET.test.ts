import { postman } from '../../../../utils'

it('get a module condensed', async () => {
  return postman.get('/module-condensed/CS1010').then((res) => {
    expect(res.status).toBe(200)
  })
})
