import { PrereqTree, Module as NusmodsModule } from '../../types/nusmods'
import { firestore } from 'firebase-admin'
import { converter, flatten } from './converter'

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
    console.log('checkTree', prereqTree)
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

  /**
   * retrieves a module by exact match (and)
   * @param {Record<string, string>} search query
   * @returns {Promise<NusmodsModule>}
   */
  export const getMod = async (
    search: Record<string, string>
  ): Promise<NusmodsModule> => {
    const collectionRef = firestore()
      .collection('modules')
      .withConverter(converter.nusmodsModule)
    const arr = Object.entries(search)
    let query = collectionRef.where(arr[0][0], '==', arr[0][1])
    for (let i = 1; i < arr.length; i++) {
      query = query.where(arr[i][0], '==', arr[i][1])
    }
    const snapshot = await query.get()
    const result: NusmodsModule[] = snapshot.docs
      .map((doc) => doc.data())
      .filter((x) => x !== undefined)
    if (result.length === 0) {
      return flatten.nusmodsModule({})
    }
    return result[0]
  }
}

export { converter, flatten } from './converter'
