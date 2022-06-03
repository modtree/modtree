import { PrereqTree } from '../../types/nusmods'
export * from './array'
export * from './object'
export * from './string'
export * from './entity'
export * from './empty'

export namespace utils {
  /**
   * sees if a user is eligible to take a mod, given the modules he/she has cleared
   * @param {PrereqTree} prereqTree
   * @param {string[]} modulesCleared
   * @return {boolean}
   */
  export function checkTree(
    prereqTree: PrereqTree,
    modulesCleared: string[]
  ): boolean {
    if (prereqTree === '') return true
    else if (typeof prereqTree === 'string') {
      return modulesCleared.includes(prereqTree)
    } else if (Array.isArray(prereqTree.and)) {
      return prereqTree.and.every((one: PrereqTree) =>
        checkTree(one, modulesCleared)
      )
    } else if (Array.isArray(prereqTree.or)) {
      return prereqTree.or.some((one: PrereqTree) =>
        checkTree(one, modulesCleared)
      )
    } else {
      console.warn('not supposed to be here')
      return true
    }
  }
}
