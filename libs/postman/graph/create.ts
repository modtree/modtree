import { ParseArgs, postman } from '../postman'

function help() {
  console.log('\nUSAGE:\n')
  console.log('yarn graph:create <user id> <degree id>\n')
  Promise.all([postman.get('users/'), postman.get('degrees/')]).then(
    ([users, degrees]) => {
      const userSummary = users.map((u: any) => ({ id: u.id, u: u.username }))
      const degreeSummary = degrees.map((d: any) => ({ id: d.id, t: d.title }))
      console.log('users:', userSummary)
      console.log('degrees:', degreeSummary)
    }
  )
}

const args = new ParseArgs(__filename, help)
const [userId, degreeId] = args.postArgs
postman.post('graphs/', {
  userId,
  degreeId,
  modulesPlacedCodes: [],
  modulesHiddenCodes: [],
  pullAll: true,
})
