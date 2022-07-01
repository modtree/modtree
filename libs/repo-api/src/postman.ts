import axios from 'axios'

export class postman {
  static url = 'http://localhost:8080'
  static get(endpoint: string, params?: any) {
    console.log('Sending request to ' + postman.url + endpoint)
    return axios.get(postman.url + endpoint, params)
  }
  static post(endpoint: string, params?: any) {
    return axios.post(postman.url + endpoint, params)
  }
  static patch(endpoint: string, params?: any) {
    return axios.patch(postman.url + endpoint, params)
  }
  static delete(endpoint: string, params?: any) {
    return axios.delete(postman.url + endpoint, params)
  }
}
