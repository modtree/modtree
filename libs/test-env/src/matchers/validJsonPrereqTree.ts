import type { NUSMods } from '@modtree/types'

/**
 * checks deeply if two arrays contains the same elements
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export function validJsonPrereqTree(received: NUSMods.PrereqTree) {
  if (Array.isArray(received) || typeof received === 'string') {
    return false
  }
  let flag = true
  const codes = new Set<string>()

  /**
   * refresher:
   *
   * type PrereqTree =
   *   | string
   *   | {
   *       and?: PrereqTree[]
   *       or?: PrereqTree[]
   *     }
   */
  const recurse = (tree: NUSMods.PrereqTree) => {
    if (typeof tree === 'string') {
      codes.add(tree)
      return
    }
    const entries = Object.entries(tree)
    entries.forEach(([key, nestedList]) => {
      /**
       * if key is anything but and/or,
       * it's an invalid pre-req tree
       */
      if (!['and', 'or'].includes(key)) {
        flag = false
        return
      }
      /**
       * if nested list is not an array, then invalid too
       */
      if (!Array.isArray(nestedList)) {
        flag = false
      }
      /**
       * recurse down each entry of the nested list
       */
      nestedList.forEach(recurse)
    })
  }
  recurse(received)
  return flag
}
