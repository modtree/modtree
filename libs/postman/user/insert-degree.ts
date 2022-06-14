import { postman } from '../postman'

const user = {
  id: '6e0000d8-48a9-41e0-8163-8466f6381d46',
  savedDegrees: ['456ffd23-1d48-48da-beec-532ce058f902'],
}

postman.post(`user/insert-degree/${user.id}`, {
  degreeIds: user.savedDegrees,
})
