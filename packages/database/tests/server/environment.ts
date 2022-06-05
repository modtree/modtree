import axios from 'axios'
import { Agent } from 'http'
import { response } from '../../types/api-response'

export const server = axios.create({
  baseURL: 'http://localhost:8080/',
  timeout: 60000,
  maxRedirects: 10,
  httpsAgent: new Agent({ keepAlive: true }),
})

export function setup() {
  expect.extend({
    toBeUserResponse(received: response.User) {
      const c1 = typeof received.id === 'string' && received.id.length > 0
      const checks = [c1]
      return checks.every((x) => x === true)
        ? {
            pass: true,
            message: () =>
              `Expected ${received} not to be a valid User API response`,
          }
        : {
            pass: false,
            message: () =>
              `Expected ${received} to be a valid User API response`,
          }
    },
  })
}
