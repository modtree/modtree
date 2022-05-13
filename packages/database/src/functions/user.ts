import { container, AppDataSource } from '../data-source'
import { User } from '../entity'

export const add = async() => {
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
  await container(async () => {
    // find user
    const repo = AppDataSource.getRepository(User)
    const user = await repo.findOne({
      where: {
        username: 'nvkhang',
      },
    })

    // user is initialized with MA2001 completed
    const res = await user.canTakeModule('MA2101')
    expect(res).toEqual(true)
  })
}
