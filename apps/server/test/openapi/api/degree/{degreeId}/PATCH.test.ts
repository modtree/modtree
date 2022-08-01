import { init, postman } from '../../../../utils'

let degreeId: string

it('create a degree', async () => {
  return postman.post('/degree', init.Degree).then((res) => {
    expect(res.status).toBe(200)
    degreeId = res.data.data.id
  })
})

it('returns 200', async () => {
  return postman
    .patch(`/degree/${degreeId}`, {
      title: 'New Degree',
      moduleCodes: ['EL1101E'],
    })
    .then((res) => {
      expect(res.status).toBe(200)
    })
})
