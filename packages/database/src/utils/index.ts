import { PrereqTree } from '../../types/nusmods'

export * from './array'
export * from './object'
export * from './string'
export * from './entity'
export * from './empty'

/**
 * unsorted utils
 */
export class Utils {
  /**
   * sees if a user is eligible to take a mod, given the modules he/she has cleared
   *
   * @param {PrereqTree} prereqTree
   * @param {string[]} modulesCleared
   * @returns {boolean}
   */
  static checkTree(prereqTree: PrereqTree, modulesCleared: string[]): boolean {
    if (prereqTree === '') return true
    if (typeof prereqTree === 'string') {
      return modulesCleared.includes(prereqTree)
    }
    if (Array.isArray(prereqTree.and)) {
      return prereqTree.and.every((one: PrereqTree) =>
        Utils.checkTree(one, modulesCleared)
      )
    }
    if (Array.isArray(prereqTree.or)) {
      return prereqTree.or.some((one: PrereqTree) =>
        Utils.checkTree(one, modulesCleared)
      )
    }
    throw new Error('not supposed to be here')
  }
}
