import { NUSMods } from '@modtree/types'
import { validModuleCode } from '@modtree/utils'

type Result = {
  valid: boolean
  codes: string[]
}

type Tree = NUSMods.PrereqTree

/**
 * single-level check to see if a tree is valid
 *
 * does not recurse.
 *
 * @param {Tree} tree
 * @returns {boolean}
 */
export function validTreeBase(tree: Tree): boolean {
  /**
   * skip if it's a string
   */
  if (typeof tree === 'string') return true
  if (
    // reject empties
    tree === undefined ||
    tree == null ||
    // tree must have at least one key
    Object.keys(tree).length === 0
  ) {
    return false
  }
  return Object.entries(tree).every(
    // tree keys can only be `and` or `or`
    ([key, value]) =>
      ['and', 'or'].includes(key) &&
      // tree values can only be arrays
      Array.isArray(value) &&
      // tree array values are valid codes (don't check deeper levels)
      value.every((code) =>
        typeof code === 'string' ? validModuleCode(code) : true
      )
  )
}

/**
 * gets an array of all module codes in a tree
 * and also checks if it's valid
 *
 * @param {Tree} tree
 * @returns {Result}
 */
export function getNestedCodes(tree: Tree): Result {
  if (tree === '') return { valid: true, codes: [] }
  let valid = validTreeBase(tree)
  const codeSet = new Set<string>()
  function recurse(tree: Tree) {
    if (!validTreeBase(tree) && !Array.isArray(tree)) {
      valid = false
      return
    }
    if (typeof tree === 'string') {
      codeSet.add(tree)
      return
    }
    if (Array.isArray(tree)) {
      tree.forEach((code) => codeSet.add(code))
      return
    }
    const entries = Object.entries(tree)
    entries.forEach(([key, nestedList]) => {
      if (['and', 'or'].includes(key)) {
        nestedList.forEach(recurse)
      } else {
        valid = false
      }
    })
  }
  recurse(tree)
  const codes = Array.from(codeSet)
  // check that all codes in the final array are valid
  const allCodesValid = codes.every(validModuleCode)
  return valid && allCodesValid ? { valid, codes } : { valid, codes: [] }
}
