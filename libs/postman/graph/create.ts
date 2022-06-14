// const graph = {
//   userId: '7e0000d8-48a9-41e0-8163-8466f6381d46',
//   degreeId: '456ffd23-1d48-48da-beec-532ce058f902',
//   modulesPlacedCodes: [],
//   modulesHiddenCodes: [],
//   pullAll: true,
// }
//
// postman.post('graph/create', graph)
//
import { ParseArgs, postman } from '../postman'

const degrees = [
  {
    moduleCodes: [
      'CS1101S',
      'CS1231S',
      'CS2030S',
      'CS2040S',
      'CS2100',
      'CS2103T',
      'CS2106',
      'CS2109S',
      'CS3230',
      'MA1521',
      'MA2001',
      'ST2334',
      'CP4101',
    ],
    title: 'Computer_Science',
  },
]

function help() {
  console.log('\nUSAGE:\n')
  console.log('yarn graph:create <user id> <degree id>\n')
  Promise.all([postman.get('user/list'), postman.get('degree/list')]).then(
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
postman.post('graph/create', {
  userId,
  degreeId,
  modulesPlacedCodes: [],
  modulesHiddenCodes: [],
  pullAll: true,
})
