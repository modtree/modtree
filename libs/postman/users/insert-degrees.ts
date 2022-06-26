import { postman } from '../postman'

const user = {
  id: 'e9f66c30-c96f-4ebd-b771-99ae8646f438',
  savedDegrees: ['e8bb5bf7-3f7d-4853-828f-952c99344241'],
}

postman
  .patch(`user/${user.id}/degrees`, {
    degreeIds: user.savedDegrees,
  })
  .then(console.log)
