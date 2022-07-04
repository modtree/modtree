import axios from 'axios'

axios
  .get('http://localhost:8080/user/7ffc9d39-8ac8-424e-a41a-6c017723cc7e')
  .then((res) => {
    console.debug(res.data)
  })
  .catch((err) => {
    console.debug(err.response.data)
    console.debug(Object.keys(err.response))
  })
