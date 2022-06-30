import axios from 'axios'

const sub = 'auth0|62a8b56d430b9f20930583f7'
const email = 'brew4k@gmail.com'

axios
  .post('http://localhost:3000/api/users/login', {
    authZeroId: sub,
    email,
  })
  .then((res) => {
    console.debug('then')
    console.debug(res)
  })
  .catch((err) => {
    console.debug('catch')
    console.debug(err)
  })
