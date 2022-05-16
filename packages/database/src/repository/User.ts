import { AppDataSource, container } from '../data-source'
import { User } from '../entity/User'
import { UserInitProps, UserProps } from '../../types/modtree'
import { In } from 'typeorm'
import { ModuleRepository } from './Module'

const Repository = AppDataSource.getRepository(User)

/**
 * Constructor for User
 * @param {UserProps} props
 * @return {User}
 */
function build(props: UserProps): User {
  const user = new User()
  user.displayName = props.displayName || ''
  user.username = props.username || ''
  user.modulesCompleted = props.modulesCompleted || []
  user.modulesDoing = props.modulesDoing || []
  user.matriculationYear = props.matriculationYear || 2021
  user.graduationYear = props.graduationYear || 2025
  user.graduationSemester = props.graduationSemester || 2
  return user
}

/**
 * Adds a User to DB
 * @param {UserProps} props
 * @return {Promise<void>}
 */
async function initialize(props: UserInitProps): Promise<void> {
  await container(async () => {
    // find modules completed and modules doing, to create many-to-many relation
    const modulesCompleted = await ModuleRepository.find({
      where: {
        moduleCode: In(props.modulesCompleted),
      },
    })
    const modulesDoing = await ModuleRepository.find({
      where: {
        moduleCode: In(props.modulesDoing),
      },
    })

    const userProps: UserProps = {
      displayName: props.displayName,
      username: props.username,
      modulesCompleted: modulesCompleted || [],
      modulesDoing: modulesDoing || [],
      matriculationYear: props.matriculationYear,
      graduationYear: props.graduationYear,
      graduationSemester: props.graduationSemester
    }

    const user = build(userProps)
    await AppDataSource.manager.save(user)
  })
}

export const UserRepository = Repository.extend({
  initialize,
  build,
})
