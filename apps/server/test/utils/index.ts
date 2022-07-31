import axios from 'axios'

export class postman {
  static backend = 'http://localhost:8080'

  static async root() {
    return axios.get(postman.backend)
  }
}
