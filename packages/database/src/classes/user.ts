import { Module } from "../entity"

export class User {
  displayName: string
  username: string
  modulesCompleted: Module[]
  modulesDoing: Module[]
  degree: undefined // TODO: implement Degree class
  savedDegrees: undefined[] // TODO: implement Degree class
  public constructor() {
    this.displayName = ''
    this.username = ''
    this.modulesCompleted = []
    this.modulesDoing = []
    this.degree = undefined
    this.savedDegrees= undefined
  }
}
