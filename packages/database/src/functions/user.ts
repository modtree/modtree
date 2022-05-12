import { container, AppDataSource } from '../data-source'
import { User } from '../entity'

export const addUser = async() => {
  await container(async() => {
    const a = new User()
    a.username = 'nvkhang'
    a.displayName = 'Nguyen Vu Khang'
    a.modulesCompleted = ['MA2001']
    a.modulesDoing = ['MA2219']
    a.matriculationYear = 2021
    a.graduationYear = 2025
    a.graduationSemester = 2
    await AppDataSource.manager.save(a)
  })
}

export const canTakeModule = async() => {
  await container(async() => {
    const user = new User()
    await user.canTakeModule('CS1010S')
  })
}
