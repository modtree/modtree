import { arrayDeepEqual } from './matchers'

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeYes: () => R
      toIncludeSameMembers: <T>(expected: T[]) => R
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
}

if (expect === undefined) {
  throw new Error("Unable to find Jest's global expect.")
} else {
  expect.extend(extendMap)
}

export {}
