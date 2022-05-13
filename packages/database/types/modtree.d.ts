export type ModtreeFunction<T> = () => Promise<T>

export type UserProps = {
  displayName: string,
  username: string,
  modulesCompleted: string[],
  modulesDoing: string[],
  matriculationYear: number,
  graduationYear: number,
  graduationSemester: number,
}

export type DegreeInitProps = {
  moduleCodes: string[]
  title: string
}

export type DegreeProps = {
  modulesRequired: Module[]
  title: string
}
