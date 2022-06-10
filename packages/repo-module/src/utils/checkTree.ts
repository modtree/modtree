import { NUSMods } from '@modtree/types'

/**
 * Given a module's prereqTree, and modules done,
 * check if a user is eligible to take a mod.
 *
 * @param {NUSMods.PrereqTree} prereqTree
 * @param {string[]} modulesDone
 * @returns {boolean}
 */
export function checkTree(
  prereqTree: NUSMods.PrereqTree,
  modulesDone: string[]
): boolean {
  if (prereqTree === '') return true
  if (typeof prereqTree === 'string') {
    return modulesDone.includes(prereqTree)
  }
  if (Array.isArray(prereqTree.and)) {
    return prereqTree.and.every((one: NUSMods.PrereqTree) =>
      checkTree(one, modulesDone)
    )
  }
  if (Array.isArray(prereqTree.or)) {
    return prereqTree.or.some((one: NUSMods.PrereqTree) =>
      checkTree(one, modulesDone)
    )
  }
  throw new Error('not supposed to be here')
}
