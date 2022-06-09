import { PrereqTree } from '../../types/nusmods'

/**
 * Given a module's prereqTree, and modules done,
 * check if a user is eligible to take a mod.
 *
 * @param {PrereqTree} prereqTree
 * @param {string[]} modulesDone
 * @returns {boolean}
 */
export function checkTree(prereqTree: PrereqTree, modulesDone: string[]): boolean {
  if (prereqTree === '') return true
  if (typeof prereqTree === 'string') {
    return modulesDone.includes(prereqTree)
  }
  if (Array.isArray(prereqTree.and)) {
    return prereqTree.and.every((one: PrereqTree) =>
      checkTree(one, modulesDone)
    )
  }
  if (Array.isArray(prereqTree.or)) {
    return prereqTree.or.some((one: PrereqTree) =>
      checkTree(one, modulesDone)
    )
  }
  throw new Error('not supposed to be here')
}
