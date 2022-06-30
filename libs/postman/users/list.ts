// import { postman } from '../postman'
import axios from 'axios'

axios
  .get('http://localhost:8080/users', {
    params: { yes: 'a@b.com' },
  })
  .then((res) => {
    console.debug(res.data)
  })
  .catch((err) => {
    console.debug(err.response.data)
    console.debug(Object.keys(err.response))
  })

// postman.get('user').then((res) => {
//   const pretty = res.map((u: any) => ({
//     id: u.id,
//     user: u.username,
//     graphs: u.savedGraphs,
//     degrees: u.savedDegrees,
//   }))
//   console.debug(pretty)
// })
