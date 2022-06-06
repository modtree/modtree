import { Module as NM, ModuleCondensed as NMC } from './nusmods'

export type User = {
  displayName: string
  username: string
  modulesDone: string[]
  modulesDoing: string[]
  matriculationYear: number
  graduationYear: number
  graduationSemester: number
  email: string
}

export type Degree = {
  moduleCodes: string[]
  title: string
}

export type Graph = {
  userId: string
  degreeId: string
  modulesPlacedCodes: string[]
  modulesHiddenCodes: string[]
  pullAll: boolean
}

export type Module = NM
export type ModuleCondensed = NMC
