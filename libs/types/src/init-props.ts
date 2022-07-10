import { PrereqTree } from './nusmods'

export type InitDegreeProps = {
  moduleCodes: string[]
  title: string
}

export type InitUserProps = {
  /**
   * required
   * (immediately available after signing up with auth0)
   */
  authZeroId: string
  email: string
  /** optional */
  modulesDone?: string[]
  modulesDoing?: string[]
  displayName?: string
  username?: string
  matriculationYear?: number
  graduationYear?: number
  graduationSemester?: number
}

export type InitGraphProps = {
  title: string
  userId: string
  degreeId: string
  pullAll: boolean
}

export type InitModuleCondensedProps = {
  moduleCode: string
  title: string
}

export type InitModuleProps = {
  moduleCode: string
  title: string
  description: string
  prerequisite: string
  corequisite: string
  preclusion: string
  prereqTree: PrereqTree
  fulfillRequirements: string[]
}
