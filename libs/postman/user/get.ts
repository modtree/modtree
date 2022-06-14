import { postman } from '../postman'

const id = '9f0b22dd-e076-4677-9968-5ac4c49155d1'

postman.get(`user/get/${id}`).then(console.log)
