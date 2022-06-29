// import { postman } from '../postman'
import axios from 'axios'

axios
  .post(
    'http://modtree-server.herokuapp.com/user/auth0|62a8b56d430b9f20930583f7/login',
    {
      email: 'brew4k@gmail.com',
    }
  )
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
