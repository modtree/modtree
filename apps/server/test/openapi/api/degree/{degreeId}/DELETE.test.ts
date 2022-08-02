import { init, postman } from '../../../../utils'

let degreeId: string

it('create a degree', async () => {
  return postman.post('/degree', init.Degree).then((res) => {
    expect(res.status).toBe(200)
    degreeId = res.data.data.id
  })
})

it('delete a degree', async () => {
  return postman.delete(`/degree/${degreeId}`).then((res) => {
    expect(res.status).toBe(200)
  })
})
