export type ModtreeFunction<T> = () => Promise<T>
type Data = string | number | boolean
type BaseArgs = Partial<Record<string, Data>>

export type ModtreeFunctionWithArgs<A extends BaseArgs, T> = (
  args: A
) => Promise<T>

export type UserProps = {
  displayName: string
  username: string
  modulesCompleted: string[]
  modulesDoing: string[]
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
    static async get(): Promise<Module[]>
    /**
     * get module codes from the module table
     * @return {Promise<Set<string>>}
     */
    static async getCodes(): Promise<Set<string>>
    static async fetchOne(moduleCode: string): Promise<Module>
    static async pull(): Promise<Module[]>
  }
}
