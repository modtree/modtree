import axios from 'axios'

axios
  .get('http://localhost:8080/user', {
    params: {
      id: '58201858-5ce5-4ceb-8568-eecf55841b9f',
      // authZeroId: 'auth0|62a8b56d430b9f20930583f7',
      // email: 'brew4k@gmail.com',
    },
  })
  .then((res) => {
    console.debug(res.data)
  })
  .catch((err) => {
    console.debug(err.response.data)
    console.debug(Object.keys(err.response))
  })
