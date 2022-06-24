import { NUSMods } from '@modtree/types'

type Result = {
  valid: boolean
  codes: string[]
}

/**
 * gets an array of all module codes in a tree
 * and also checks if it's valid
 *
 * @param {NUSMods.PrereqTree} tree
 * @returns {Result}
 */
export function getNestedCodes(tree: NUSMods.PrereqTree): Result {
  let valid = !Array.isArray(tree)
  const codes = new Set<string>()
  function recurse(tree: NUSMods.PrereqTree) {
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
  return {
    valid,
    codes: Array.from(codes),
  }
}
