import { z } from 'zod'

/**
 * Converts a string to lowercase and
 * replaces spaces with dashes.
 *
 * e.g. 'Computer Science' -> 'computer-science'
 */
export function lowercaseAndDash(str: string) {
  return str.replace(/\s+/g, '-').toLowerCase()
}

export function isUUID(str: string | undefined): boolean {
  if (!str) return false
  return z.string().uuid().safeParse(str).success === true
}
