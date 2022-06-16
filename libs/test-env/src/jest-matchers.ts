import { arrayDeepEqual, arrayOfType } from './matchers'

declare global {
  /* eslint-disable @typescript-eslint/no-namespace */
  namespace jest {
    interface Matchers<R> {
      toBeYes: () => R
      toIncludeSameMembers: <T>(expected: T[]) => R
      toBeArrayOf: <T>(expected: T) => R
    }
  }
}

const extendMap: jest.ExpectExtendMap = {
  /**
   * custom matcher hello world
   */
  toBeYes(received: string) {
    const pass = received === 'yes'
    this.equals
    return { pass, message: () => (pass ? 'yep' : 'nope') }
  },

  /**
   * check to ensure that two arrays have the same memebers,
   * regardless of order
   */
  toIncludeSameMembers(actual, expected) {
    const { printReceived, printExpected, matcherHint } = this.utils
    const passMessage =
      matcherHint('.not.toIncludeSameMembers') +
      '\n\n' +
      'Expected list to not exactly match the members of:\n' +
      `  ${printExpected(expected)}\n` +
      'Received:\n' +
      `  ${printReceived(actual)}`
    const failMessage =
      matcherHint('.toIncludeSameMembers') +
      '\n\n' +
      'Expected list to have the following members and no more:\n' +
      `  ${printExpected(expected)}\n` +
      'Received:\n' +
      `  ${printReceived(actual)}`
    const pass = arrayDeepEqual(this.equals, actual, expected)
    return { pass, message: () => (pass ? passMessage : failMessage) }
  },

  /**
   * check if is an array of the provided argument
   */
  toBeArrayOf(received, expected) {
    const { printReceived, printExpected, matcherHint } = this.utils
    const passMessage =
      matcherHint('.not.toBeArrayOf') +
      '\n\n' +
      'Expected list members to not all be of type:\n' +
      `  ${printExpected(expected)}\n` +
      'Received:\n' +
      `  ${printReceived(received)}`
    const failMessage =
      matcherHint('.toBeArrayOf') +
      '\n\n' +
      'Expected list elements to all be of type:\n' +
      `  ${printExpected(expected)}\n` +
      'Received:\n' +
      `  ${printReceived(received)}`
    const pass = arrayOfType(received, expected)
    return { pass, message: () => (pass ? passMessage : failMessage) }
  },
}

if (expect === undefined) {
  throw new Error("Unable to find Jest's global expect.")
} else {
  expect.extend(extendMap)
  beforeEach(expect.hasAssertions)
}

export {}
