import { init, postman } from '../../../../utils'

let degreeId: string

it('create a degree', async () => {
  const res = await postman.post('/degree', init.Degree)
  expect(res.status).toBe(200)
  /**
   * first .data is regular res.data
   * second .data is trpc-openapi format
   */
  degreeId = res.data.data.id
})

it('returns 200', async () => {
  const res = await postman.get(`/degree/${degreeId}`)
  expect(res.status).toBe(200)
})
