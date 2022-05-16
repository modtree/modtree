export type ModtreeFunction<T> = () => Promise<T>
type Data = string | number | boolean
type BaseArgs = Partial<Record<string, Data>>

export type ModtreeFunctionWithArgs<A extends BaseArgs, T> = (
  args: A
) => Promise<T>

export type UserInitProps = {
  displayName: string
  username: string
  modulesCompleted: string[]
  modulesDoing: string[]
  matriculationYear: number
  graduationYear: number
  graduationSemester: number
}

export type UserProps = {
  displayName: string
  username: string
  modulesCompleted: Module[]
  modulesDoing: Module[]
  matriculationYear: number
  graduationYear: number
  graduationSemester: number
}

export type DegreeInitProps = {
  moduleCodes: string[]
  title: string
}

export type DegreeProps = {
  modulesRequired: Module[]
  title: string
}

declare namespace modtree {
  export class Module {
    static get(): Promise<Module[]>
    static getCodes(): Promise<Set<string>>
    static fetchOne(moduleCode: string): Promise<Module>
    static pull(): Promise<Module[]>
  }
}
