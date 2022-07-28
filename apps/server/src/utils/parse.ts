/**
 * Converts a comma separated string into a string array.
 *
 * If any input checks fail, return empty array.
 */
export function parseCommaSeparatedString(input: string) {
  /** input checking **/
  // assert string
  const isString = typeof input === 'string'
  if (!isString) {
    return []
  }

  /** assume string is safe **/
  const a = input
    // remove trailing and preceding whitespaces
    .trim()
    .split(',')
    // trim whitespaces in each module code
    .map((element) => element.trim())
  return a
}
