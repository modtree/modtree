import axios from 'axios'

const sub = 'auth0|62a8b56d430b9f20930583f7'
const email = 'brew4k@gmail.com'

axios
  .post('http://localhost:3000/api/users/login', {
    authZeroId: sub,
    email,
  })
  .then((res) => {
    console.log('then')
    console.log(res)
  })
  .catch((err) => {
    console.log('catch')
    console.log(err)
  })
