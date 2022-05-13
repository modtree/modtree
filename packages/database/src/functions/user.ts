import { container, AppDataSource } from '../data-source'
import { User } from '../entity'

/**
 * Adds a User to DB
 */
export async function add() {
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

/**
 * Checks if a user can take a module, given their completed modules
 * Currently does not check for preclusion
 */
export async function canTakeModule() {
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
