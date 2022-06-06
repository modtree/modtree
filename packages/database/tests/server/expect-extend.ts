import { ResponseProps } from '../../types/api-response'
import { EmptyResponse } from '../../src/utils'

export function toBeUserResponse(user: ResponseProps['User']) {
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
        message: () => `Expected ${user} not to be a valid User API response`,
      }
    : {
        pass: false,
        message: () => `Expected ${user} to be a valid User API response`,
      }
}
