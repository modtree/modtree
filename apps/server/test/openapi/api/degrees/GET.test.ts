import { init, postman } from '../../../utils'

let degreeId: string

it('create a degree', async () => {
  return postman.post('/degree', init.Degree).then((res) => {
    expect(res.status).toBe(200)
    degreeId = res.data.data.id
  })
})

it('get many degrees', async () => {
  return postman.get('/degrees', { degreeIds: [degreeId] }).then((res) => {
    expect(res.status).toBe(200)
  })
})
