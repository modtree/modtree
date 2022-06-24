import { NUSMods } from '@modtree/types'

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
  if (typeof tree === 'string') {
    return true
  }
  /**
   * tree must have at least one key
   */
  if (Object.keys(tree).length === 0) {
    return false
  }
  return Object.entries(tree).every(
    ([key, value]) => ['and', 'or'].includes(key) && Array.isArray(value)
  )
}
