import axios from 'axios'

axios
  .get('http://localhost:8080/graphs', {
    params: {
      graphIds: [
        '48451593-f456-4f01-bd0e-91930c0d10bc',
        '5657c190-5864-4ebc-8aac-17b96600a3bd',
      ],
    },
  })
  .then((res) => {
    console.debug(res.data)
  })
  .catch((err) => {
    console.debug(err.response.data)
    console.debug(Object.keys(err.response))
  })
