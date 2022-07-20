import { PrereqTree } from './nusmods'

export type InitGraphProps = {
  title: string
  userId: string
  degreeId: string
}

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
