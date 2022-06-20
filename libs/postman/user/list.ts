// import { postman } from '../postman'
import axios from 'axios'

axios
  .get('http://localhost:8080/users')
  .then((res) => {
    console.log(res.data)
  })
  .catch((err) => {
    console.log(err.response.data)
    console.log(Object.keys(err.response))
  })

// postman.get('user').then((res) => {
//   const pretty = res.map((u: any) => ({
//     id: u.id,
//     user: u.username,
//     graphs: u.savedGraphs,
//     degrees: u.savedDegrees,
//   }))
//   console.log(pretty)
// })
