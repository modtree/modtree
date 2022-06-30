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
