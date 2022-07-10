import { ParseArgs, postman } from '../postman'

function help() {
  console.debug('\nUSAGE:\n')
  console.debug('yarn graph:create <user id> <degree id>\n')
  Promise.all([postman.get('users/'), postman.get('degrees/')]).then(
    ([users, degrees]) => {
      const userSummary = users.map((u: any) => ({ id: u.id, u: u.username }))
      const degreeSummary = degrees.map((d: any) => ({ id: d.id, t: d.title }))
      console.debug('users:', userSummary)
      console.debug('degrees:', degreeSummary)
    }
  )
}

const args = new ParseArgs(__filename, help)
const [userId, degreeId] = args.postArgs

postman
  .post('graph/', {
    userId,
    degreeId,
    modulesPlacedCodes: [],
    modulesHiddenCodes: [],
  })
  .then((graph) =>
    postman.patch(`user/${userId}/graph/`, {
      graphIds: [graph.id],
    })
  )
  .then(console.debug)
