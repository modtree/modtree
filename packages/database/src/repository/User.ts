import { container } from '../data-source'
import { DataSource, In, Repository } from 'typeorm'
import { Init, UserProps } from '../../types/modtree'
import { User } from '../entity/User'
import { Module } from '../entity/Module'
import { ModuleRepository } from './Module'
import { utils } from '../utils'
import { useLoadRelations } from './base'
import { db as DefaultSource } from '../config'

interface UserRepository extends Repository<User> {
  build(props: UserProps): User
  initialize(props: Init.UserProps): Promise<void>
  canTakeModule(user: User, moduleCode: string): Promise<boolean | void>
}

/**
 * @param {DataSource} database
 * @return {UserRepository}
 */
export function UserRepository(database?: DataSource): UserRepository {
  const db = database || DefaultSource
  const BaseRepo = db.getRepository(User)
  const loadRelations = useLoadRelations(BaseRepo)

  /**
   * Constructor for User
   * @param {UserProps} props
   * @return {User}
   */
  function build(props: UserProps): User {
    const user = new User()
    user.displayName = props.displayName || ''
    user.username = props.username || ''
    user.modulesDone = props.modulesDone || []
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
  async function initialize(props: Init.UserProps): Promise<void> {
    await container(db, async () => {
      // find modules completed and modules doing, to create many-to-many relation
      const modulesDone = await ModuleRepository(db).find({
        where: {
          moduleCode: In(props.modulesDone),
        },
      })
      const modulesDoing = await ModuleRepository(db).find({
        where: {
          moduleCode: In(props.modulesDoing),
        },
      })
      const userProps: UserProps = {
        displayName: props.displayName,
        username: props.username,
        modulesDone: modulesDone || [],
        modulesDoing: modulesDoing || [],
        matriculationYear: props.matriculationYear,
        graduationYear: props.graduationYear,
        graduationSemester: props.graduationSemester,
      }
      const user = build(userProps)
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
      // find module
      const module = await ModuleRepository(db).findOne({
        where: {
          moduleCode: moduleCode,
        },
      })
      /* Relations are not stored in the entity, so they must be explicitly
       * asked for from the DB
       */
      const retrieved = await BaseRepo.findOne({
        where: {
          id: user.id,
        },
      })
      await loadRelations(retrieved, { modulesDone: true })
      const modulesDone = retrieved.modulesDone
      // check if PrereqTree is fulfilled
      const completedModulesCodes = modulesDone.map(
        (one: Module) => one.moduleCode
      )
      return utils.checkTree(module.prereqTree, completedModulesCodes)
    })
  }
  return BaseRepo.extend({
    canTakeModule,
    build,
    initialize,
    loadRelations
  })
}
