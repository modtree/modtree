/**
 * Converts a string to lowercase and
 * replaces spaces with dashes.
 *
 * e.g. 'Computer Science' -> 'computer-science'
 */
export function lowercaseAndDash(str: string) {
  return str.replace(/\s+/g, '-').toLowerCase()
}
