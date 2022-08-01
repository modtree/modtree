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
  static async post(endpoint: string, params?: any) {
    return axios.post(postman.url + endpoint, params)
  }
  static async patch(endpoint: string, params?: any) {
    return axios.patch(postman.url + endpoint, params)
  }
  static async delete(endpoint: string) {
    return axios.delete(postman.url + endpoint)
  }
}
