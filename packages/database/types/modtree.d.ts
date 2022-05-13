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
