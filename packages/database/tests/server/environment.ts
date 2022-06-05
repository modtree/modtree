import axios from 'axios'
import { Agent } from 'http'
import { nonEmtpyString } from '../../src/utils'
import { response } from '../../types/api-response'

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
    toBeUserResponse(user: response.User) {
      const checks = [
        nonEmtpyString(user.id),
        nonEmtpyString(user.displayName),
        nonEmtpyString(user.username),
        user.graduationYear > 0,
        user.graduationSemester > 0,
        user.graduationSemester > 0,
        user.modulesDone instanceof Array,
        user.modulesDoing instanceof Array,
        user.savedDegrees instanceof Array,
        user.savedGraphs instanceof Array,
      ]
      return checks.every((x) => x === true)
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
