import axios from 'axios'
import { postman } from '../postman'

const moduleCodes = ['MA2001', 'CS1231S', 'EL1101E']

axios
  .get('http://localhost:8080/api/modules', {
    params: { moduleCodes },
  })
  .then((res) => {
    console.debug(res.data)
  })
  .catch((err) => {
    console.debug(err)
  })
