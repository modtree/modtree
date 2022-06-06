import axios from 'axios'
import { Agent } from 'http'
import { ResponseProps } from '../../types/api-response'
import { EmptyResponse } from '../../src/utils'

export const server = axios.create({
  baseURL: 'http://localhost:8080/',
  timeout: 60000,
  maxRedirects: 10,
  httpsAgent: new Agent({ keepAlive: true }),
})

/**
 * setup function for server tests
 */
export function setup() {
  expect.extend({
    toBeUserResponse(user: ResponseProps['User']) {
      const checks: boolean[] = []
      const responseKeys = Object.getOwnPropertyNames(user)
      Object.entries(EmptyResponse.User).forEach(([key, value]) => {
        // ensure that the response has each key
        checks.push(responseKeys.includes(key))
        // ensure that the response value type is correct
        checks.push(typeof user[key] === typeof value)
      })
      return checks.every(Boolean)
        ? {
            pass: true,
            message: () =>
              `Expected ${user} not to be a valid User API response`,
          }
        : {
            pass: false,
            message: () => `Expected ${user} to be a valid User API response`,
          }
    },
  })
}
