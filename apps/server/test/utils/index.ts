import axios from 'axios'

export class postman {
  static backend = 'http://localhost:8080'
  static url = postman.backend + '/api'

  static async root() {
    return axios.get(postman.backend)
  }

  static async get(endpoint: string, params?: any) {
    return axios.get(postman.url + endpoint, { params })
  }
}
