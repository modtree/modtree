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

/**
 * Returns true if the moduleCode belongs to a module that is in
 * modulesDone or modulesDoing.
 *
 * @param {string[]} modulesDone
 * @param {string[]} modulesDoing
 * @param {string} moduleCode
 * @returns {boolean}
 */
export function hasTakenModule(modulesDone: string[], modulesDoing: string[], moduleCode: string): boolean {
  const modules = modulesDone.concat(modulesDoing)
  return modules.includes(moduleCode)
}
