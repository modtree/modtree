import { NUSMods } from '@modtree/types'

export function getNestedCodes(tree: NUSMods.PrereqTree, codes: Set<string>) {
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
      }
    })
  }
  recurse(tree)
}
