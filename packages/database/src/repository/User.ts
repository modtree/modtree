import { AppDataSource, container } from '../data-source'
import { User } from '../entity-repo/User'
import { UserProps } from '../../types/modtree'

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
async function initialize(props: UserProps): Promise<void> {
  await container(async () => {
    const user = build(props)
    await UserRepository.save(user)
  })
}

export const UserRepository = Repository.extend({
  initialize,
  build,
})
