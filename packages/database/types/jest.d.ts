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
    // eslint-disable-next-line
    interface Expect extends CustomMatchers {}
    // eslint-disable-next-line
    interface Matchers<R> extends CustomMatchers<R> {}
    // eslint-disable-next-line
    interface InverseAsymmetricMatchers extends CustomMatchers {}
  }
}

/**
 * typescript complains on `declare global` without this extra line
 */
export {}
