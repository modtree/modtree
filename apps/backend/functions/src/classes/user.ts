import { utils } from '../utils'
import { Degree, Module } from '.'

/** a User class */
export class User {
  done: string[]
  degree: Degree
  /** create a User */
  constructor() {
    this.done = []
    this.degree = Degree.empty
  }
  /**
   * make the user complete a module
   * @param {string} moduleCode
   */
  do(moduleCode: string) {
    if (!this.done.includes(moduleCode)) {
      this.done.push(moduleCode)
    }
  }
  /**
   * assign a degree to the user
   * @param {Degree} degree
   */
  setDegree(degree: Degree) {
    this.degree = degree
  }
  /**
   * check to see if a user can take a module, given modules done
   * @param {string} moduleCode
   * @return {Promise<boolean>}
   */
  async canTakeModule(moduleCode: string): Promise<boolean> {
    const module = new Module(moduleCode)
    const prereqTree = await module.getPrereqTree()
    const can = utils.checkTree(prereqTree, this.done)
    return can
  }
  // TODO: list version of canTakeModule
}
