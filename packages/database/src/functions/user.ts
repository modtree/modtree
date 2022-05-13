import { container, AppDataSource } from '../data-source'
import { User } from '../entity'
import { UserProps } from '../../types/modtree'

/**
 * Adds a User to DB
 */
export async function save() {
  const props: UserProps = {
    displayName: 'Nguyen Vu Khang',
    username: 'nvkhang',
    modulesCompleted: ['MA2001'],
    modulesDoing: ['MA2219'],
    matriculationYear: 2021,
    graduationYear: 2025,
    graduationSemester: 2,
  }

  await User.save(props)
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
