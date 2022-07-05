import { NUSMods } from '@modtree/types'
import { validTreeBase } from './valid-tree-base'

type Result = {
  valid: boolean
  codes: string[]
}

type Tree = NUSMods.PrereqTree

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
  const codes = new Set<string>()
  function recurse(tree: Tree) {
    if (!validTreeBase(tree) && !Array.isArray(tree)) {
      valid = false
      return
    }
    if (typeof tree === 'string') {
      codes.add(tree)
      return
    }
    if (Array.isArray(tree)) {
      tree.forEach((code) => codes.add(code))
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
  return valid ? { valid, codes: Array.from(codes) } : { valid, codes: [] }
}
