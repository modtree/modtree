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

declare namespace modtree {
  export class Module {
    static get(): Promise<Module[]>
    static getCodes(): Promise<Set<string>>
    static fetchOne(moduleCode: string): Promise<Module>
    static pull(): Promise<Module[]>
  }
}
