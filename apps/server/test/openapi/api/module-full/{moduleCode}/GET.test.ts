import { postman } from '../../../../utils'

it('returns 200', async () => {
  return postman.get('/module-full/CS1010').then((res) => {
    expect(res.status).toBe(200)
  })
})
