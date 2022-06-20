import { postman } from '../postman'

const user = {
  id: 'e9f66c30-c96f-4ebd-b771-99ae8646f438',
  savedDegrees: ['f2b8d3e1-1907-4d60-82ee-cef57b510b9e'],
}

postman
  .post(`users/${user.id}/degree`, {
    degreeIds: user.savedDegrees,
  })
  .then(console.log)
