import { DatabaseType, MixedList } from 'typeorm'
import type { Module, Degree, User } from '../src/entity'

export type ModtreeFunction<T> = () => Promise<T>
type Data = string | number | boolean
type BaseArgs = Partial<Record<string, Data>>

export type ModtreeFunctionWithArgs<A extends BaseArgs, T> = (
  args: A
) => Promise<T>

export namespace Init {
  export type UserProps = {
    displayName: string
    username: string
    modulesDone: string[]
    modulesDoing: string[]
    matriculationYear: number
    graduationYear: number
    graduationSemester: number
  }
  export type DegreeProps = {
    moduleCodes: string[]
    title: string
  }
  export type GraphProps = {
    userId: string
    degreeId: string
    modulesPlacedCodes: string[]
    modulesHiddenCodes: string[]
    pullAll: boolean
  }
}

export type UserProps = {
  displayName: string
  username: string
  modulesDone: Module[]
  modulesDoing: Module[]
  matriculationYear: number
  graduationYear: number
  graduationSemester: number
}

export type DegreeProps = {
  modules: Module[]
  title: string
}

export type GraphProps = {
  user: User
  degree: Degree
  modulesPlaced: Module[]
  modulesHidden: Module[]
}

declare namespace modtree {
  /** Module Class */
  export class Module {
    static get(): Promise<Module[]>
    static getCodes(): Promise<Set<string>>
    static fetchOne(moduleCode: string): Promise<Module>
    static pull(): Promise<Module[]>
  }
}

type SupportedDatabases = Extract<DatabaseType, 'mysql' | 'postgres'>

type DataSourceOptions = {
  type: SupportedDatabases
  rootDir: string
  restoreSource: string
  port: number
  database: string
  username: string
  password: string
  host: string
  migrations: string[]
  entities: MixedList<string | Function>
  synchronize: boolean
  migrationsRun: boolean
}
