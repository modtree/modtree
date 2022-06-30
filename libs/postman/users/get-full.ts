import { postman } from '../postman'

const id = 'e9f66c30-c96f-4ebd-b771-99ae8646f438'

postman.get(`user/${id}/get-full`).then(console.debug)
