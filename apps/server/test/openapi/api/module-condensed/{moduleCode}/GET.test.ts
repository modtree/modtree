import { postman } from '../../../../utils'

it('returns 200', async () => {
  return postman.get('/module-condensed/CS1010').then((res) => {
    expect(res.status).toBe(200)
  })
})
