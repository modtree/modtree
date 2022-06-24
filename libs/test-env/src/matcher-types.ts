declare global {
  /* eslint-disable @typescript-eslint/no-namespace */
  namespace jest {
    interface Matchers<R> {
      toBeYes: () => R
      toIncludeSameMembers: <T>(expected: T[]) => R
      toBeArrayOf: <T>(expected: T) => R
      toHaveSameKeysAs: <T>(expected: T) => R
      toBeInArray: <T>(expected: T[]) => R
    }
  }
}

export {}
