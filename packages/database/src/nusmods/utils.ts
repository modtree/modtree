import { Module } from '../entity'
import { Module as NM } from '../../types/nusmods'

export const nusmodsApi = (req: string) =>
  `https://api.nusmods.com/v2/2021-2022/${req}.json`

/**
 * parses out the numbers that represent the module level
 * @param {string} moduleCode
 * @return {string}
 */
export function getModuleLevel(moduleCode: string): string {
  return moduleCode.replace(/\D*([0-9]*)\D*.*$/, '$1')
}

export const constructModule = (n: NM, m: Module) => {
  m.acadYear = n.acadYear
  m.moduleCode = n.moduleCode
  m.title = n.title
  // m.description = n.description
  m.moduleCredit = n.moduleCredit
  m.department = n.department
  m.faculty = n.faculty
  // m.workload = n.workload
  m.aliases = n.aliases
  m.attributes = n.attributes
  m.prerequisite = n.prerequisite
  m.corequisite = n.corequisite
  m.preclusion = n.preclusion
  // m.prereqTree = n.prereqTree
  m.fulfillRequirements = n.fulfillRequirements
}
