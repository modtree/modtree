/**
 * checks deeply if two arrays contains the same elements
 */
export function arrayOfType<T>(received: T[], expected: any) {
  if (
    /**
     * reject if didn't receive an array
     */
    !Array.isArray(received)
  ) {
    return false
  }

  const check = received.map((element) => element instanceof expected)
  return check.every(Boolean)
}
