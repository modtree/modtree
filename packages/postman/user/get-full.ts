import { postman } from '../postman'

const id = '6e0000d8-48a9-41e0-8163-8466f6381d46'

postman.get(`http://localhost:8080/user/get-full/${id}`)
