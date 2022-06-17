import { postman } from '../postman'

postman.get('users').then(console.log)

// postman.get('user').then((res) => {
//   const pretty = res.map((u: any) => ({
//     id: u.id,
//     user: u.username,
//     graphs: u.savedGraphs,
//     degrees: u.savedDegrees,
//   }))
//   console.log(pretty)
// })
