import { PrereqTree } from '../../types/nusmods'
import { utils } from '../utils'

/** a Module class */
export class Module {
  moduleCode: string

  /**
   * create a Module
   * @param {string} moduleCode
   */
  constructor(moduleCode: string) {
    this.moduleCode = moduleCode
  }
  /**
   * get a tree of pre-requisites
   * @return {Promise<PrereqTree>}
   */
  async getPrereqTree(): Promise<PrereqTree> {
    return utils.getMod({ moduleCode: this.moduleCode }).then((module) => {
      return module.prereqTree || ''
    })
  }
}
