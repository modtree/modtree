import { postman } from '../postman'

const id = 'e9f66c30-c96f-4ebd-b771-99ae8646f438'

postman.get(`users/${id}/get-full`).then(console.log)
