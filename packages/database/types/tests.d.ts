/**
 * this will be use in tests to extend expect()
 */
interface CustomMatchers<R = unknown> {
  toBeUserResponse(): R
}

/**
 * literally some typescript formalities
 */
declare global {
  namespace jest {
    interface Expect extends CustomMatchers {}
    interface Matchers<R> extends CustomMatchers<R> {}
    interface InverseAsymmetricMatchers extends CustomMatchers {}
  }
}

/**
 * typescript complains on `declare global` without this extra line
 */
export {}
