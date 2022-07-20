import { PrereqTree } from './nusmods'

export type InitModuleCondensedProps = {
  moduleCode: string
  title: string
}

export type InitModuleProps = {
  moduleCode: string
  title: string
  prerequisite: string
  corequisite: string
  preclusion: string
  prereqTree: PrereqTree
  fulfillRequirements: string[]
}
