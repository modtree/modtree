import { postman } from '../../../utils'

let degreeId: string

it('create a degree', async () => {
  const res = await postman.post('/degree', {
    title: 'Test Degree',
    moduleCodes: ['CS1010', 'MA2001'],
  })
  expect(res.status).toBe(200)
  degreeId = res.data.data.id
})

it('returns 200', async () => {
  const res = await postman.get(`/degrees`, { degreeIds: [degreeId] })
  expect(res.status).toBe(200)
})
