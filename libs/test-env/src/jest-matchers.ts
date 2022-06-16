declare global {
  namespace jest {
    interface Matchers<R> {
      toBeYes: () => R
      toIncludeSameMembers: <T>(expected: T[]) => R
    }
  }
}

if (expect === undefined) {
  throw new Error("Unable to find Jest's global expect.")
} else {
  expect.extend({
    toBeYes(received: string) {
      const pass = received === 'yes'
      this.equals
      return { pass, message: () => (pass ? 'yep' : 'nope') }
    },
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

      const predicate = <T>(actual: T, expected: T) => {
        if (
          !Array.isArray(actual) ||
          !Array.isArray(expected) ||
          actual.length !== expected.length
        ) {
          return false
        }

        const remaining = expected.reduce((remaining, secondValue) => {
          if (remaining === null) return remaining

          const index = remaining.findIndex((firstValue: T) =>
            this.equals(secondValue, firstValue)
          )

          if (index === -1) {
            return null
          }

          return remaining.slice(0, index).concat(remaining.slice(index + 1))
        }, actual)

        return !!remaining && remaining.length === 0
      }
      const pass = predicate(actual, expected)

      return { pass, message: () => (pass ? passMessage : failMessage) }
    },
  })
}

export {}
