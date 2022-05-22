import { container } from '../data-source'
import { DataSource, In, Repository } from 'typeorm'
import { Init, UserProps } from '../../types/modtree'
import { User } from '../entity/User'
import { Module } from '../entity/Module'
import { ModuleRepository } from './Module'
import { utils } from '../utils'
import {
  useLoadRelations,
  LoadRelations,
  getDataSource,
  useBuild,
} from './base'

interface UserRepository extends Repository<User> {
  build(props: UserProps): User
  initialize(props: Init.UserProps): Promise<void>
  canTakeModule(user: User, moduleCode: string): Promise<boolean | void>
  loadRelations: LoadRelations<User>
}

/**
 * @param {DataSource} database
 * @return {UserRepository}
 */
export function UserRepository(database?: DataSource): UserRepository {
  const db = getDataSource(database)
  const BaseRepo = db.getRepository(User)
  const loadRelations = useLoadRelations(BaseRepo)

  /**
   * Constructor for User
   * @param {UserProps} props
   * @return {User}
   */
  function build(props: UserProps): User {
    return useBuild(db, User, props)
  }

  /**
   * Adds a User to DB
   * @param {UserProps} props
   * @return {Promise<void>}
   */
  async function initialize(props: Init.UserProps): Promise<void> {
    await container(db, async () => {
      // find modules completed and modules doing, to create many-to-many relation
      const queryList = [props.modulesDone, props.modulesDoing]
      const modulesPromise = Promise.all(
        queryList.map((list) =>
          ModuleRepository(db).findBy({
            moduleCode: In(list),
          })
        )
      )
      const user = build(props)
      const [modulesDone, modulesDoing] = await modulesPromise
      user.modulesDone = modulesDone || []
      user.modulesDoing = modulesDoing || []
      await BaseRepo.save(user)
    })
  }

  /**
   * Given a module code, checks if user has cleared sufficient pre-requisites.
   * Currently does not check for preclusion.
   *
   * @param{User} user
   * @param{string} moduleCode
   * @return{Promise<boolean>}
   */
  async function canTakeModule(
    user: User,
    moduleCode: string
  ): Promise<boolean | void> {
    return await container(db, async () => {
      // 1. find module
      const module = await ModuleRepository(db).findOneBy({ moduleCode })
      // if module not found, assume invalid module code
      if (!module) {
        throw new Error('Invalid module code')
      }
      // 2. load modulesDone and modulesDoing relations
      await UserRepository(db).loadRelations(user, {
        modulesDone: true,
        modulesDoing: true,
      })
      // if module already taken, can't take module again
      const modulesDoneCodes = user.modulesDone.map((one: Module) => one.moduleCode)
      const modulesDoingCodes = user.modulesDoing.map((one: Module) => one.moduleCode)
      if (modulesDoneCodes.includes(moduleCode) || modulesDoingCodes.includes(moduleCode)) {
        return false
      }
      // 3. check if PrereqTree is fulfilled
      const modulesDone = user.modulesDone.map((m) => m.moduleCode)
      return utils.checkTree(module.prereqTree, modulesDone)
    })
  }

  return BaseRepo.extend({
    canTakeModule,
    build,
    initialize,
    loadRelations,
  })
}
