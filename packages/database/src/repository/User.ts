import { DataSource } from 'typeorm'
import { Init } from '../../types/entity'
import { User } from '../entity/User'
import { Module } from '../entity/Module'
import { Degree } from '../entity/Degree'
import { ModuleRepository } from './Module'
import { DegreeRepository } from './Degree'
import { utils } from '../utils'
import {
  useLoadRelations,
  getDataSource,
  getRelationNames,
} from './base'
import type { UserRepository as Repository } from '../../types/repository'

/**
 * @param {DataSource} database
 * @return {UserRepository}
 */
export function UserRepository(database?: DataSource): Repository {
  const db = getDataSource(database)
  const BaseRepo = db.getRepository(User)
  const loadRelations = useLoadRelations(BaseRepo)

  /**
   * Adds a User to DB
   * @param {UserProps} props
   * @return {Promise<User>}
   */
  async function initialize(props: Init.UserProps): Promise<User> {
    // find modules completed and modules doing, to create many-to-many relation
    const queryList = [props.modulesDone, props.modulesDoing]
    const modulesPromise = Promise.all(
      queryList.map((list) => ModuleRepository(db).findByCodes(list))
    )
    const [modulesDone, modulesDoing] = await modulesPromise
    const userProps = {
      ...props,
      modulesDone: modulesDone || [],
      modulesDoing: modulesDoing || [],
    }
    const user = BaseRepo.create(userProps)
    await BaseRepo.save(user)
    return user
  }

  /**
   * Given a module code, checks if user has cleared sufficient pre-requisites.
   * Currently does not check for preclusion.
   *
   * If optional string[] addedModuleCodes is specified, then each of the module
   * codes is added to modulesDoneCodes.
   *
   * @param {User} user
   * @param {string} moduleCode
   * @param {string[]} addedModuleCodes
   * @return {Promise<boolean>}
   */
  async function canTakeModule(
    user: User,
    moduleCode: string,
    addedModuleCodes?: string[]
  ): Promise<boolean | void> {
    // 1. find module
    const module = await ModuleRepository(db).findOneBy({ moduleCode })
    // -- if module not found, assume invalid module code
    if (!module) return false
    // 2. load modulesDone and modulesDoing relations
    await UserRepository(db).loadRelations(user, {
      modulesDone: true,
      modulesDoing: true,
    })
    // -- if module already taken, can't take module again
    const modulesDoneCodes = user.modulesDone.map((one) => one.moduleCode)
    const modulesDoingCodes = user.modulesDoing.map((one) => one.moduleCode)
    // -- add some module codes to done modules
    if (addedModuleCodes && addedModuleCodes.length > 0)
      addedModuleCodes.forEach((one) => {
        // ignore duplicates
        if (!modulesDoneCodes.includes(one) && !modulesDoingCodes.includes(one))
          modulesDoneCodes.push(one)
      })
    if (
      modulesDoneCodes.includes(moduleCode) ||
      modulesDoingCodes.includes(moduleCode)
    ) {
      return false
    }
    // 3. check if PrereqTree is fulfilled
    return utils.checkTree(module.prereqTree, modulesDoneCodes)
  }

  /**
   * List mods a user can take, based on what the user has completed.
   *
   * If optional string[] addedModuleCodes is specified, then each of the modules
   * are taken as done, and passed into User.canTakeModule.
   *
   * @param {User} user
   * @param {string[]} addedModuleCodes
   * @return {Promise<Module[] | void>}
   */
  async function eligibleModules(user: User, addedModuleCodes?: string[]): Promise<Module[] | void> {
    // if undefined
    if (!addedModuleCodes)
      addedModuleCodes = []
    // 1. get post-reqs
    const postReqs = await UserRepository(db).getPostReqs(user, addedModuleCodes)
    if (!postReqs)
      return []
    // 2. filter post-reqs
    const promises = postReqs.map(
      (one) => UserRepository(db).canTakeModule(user, one.moduleCode, addedModuleCodes)
    )
    const results = await Promise.all(promises)
    const filtered = postReqs.filter((_, idx) => results[idx])
    return filtered
  }

  /**
   * List all post-reqs of a user.
   * This is a union of all post-reqs, subtract modulesDone and modulesDoing.
   *
   * If optional string[] addedModuleCodes is specified, then each of the module
   * codes is added to modulesDoneCodes.
   *
   * @param {User} user
   * @param {string[]} addedModuleCodes
   *
   * @return {Promise<Module[] | void>}
   */
  async function getPostReqs(user: User, addedModuleCodes?: string[]): Promise<Module[] | void> {
    // if undefined
    if (!addedModuleCodes)
      addedModuleCodes = []
    // 1. load modulesDone and modulesDoing relations
    await UserRepository(db).loadRelations(user, {
      modulesDone: true,
      modulesDoing: true,
    })
    // 2. get array of module codes of post-reqs (fulfillRequirements)
    const postReqCodesSet = new Set<string>()
    user.modulesDone.forEach((module: Module) => {
      // can be empty string
      if (module.fulfillRequirements instanceof Array)
        module.fulfillRequirements.forEach((moduleCode: string) => {
          postReqCodesSet.add(moduleCode)
        })
    })
    const addedModules = await Promise.all(
      addedModuleCodes.map((one) => ModuleRepository(db).findOneBy({
        moduleCode: one,
      }))
    )
    addedModules.forEach((module: Module) => {
      // can be empty string
      if (module.fulfillRequirements instanceof Array)
        module.fulfillRequirements.forEach((moduleCode: string) => {
          postReqCodesSet.add(moduleCode)
        })
    })
    const postReqCodesArr = Array.from(postReqCodesSet)
    // 3. filter modulesDone and modulesDoing
    const modulesDoneCodes = user.modulesDone.map((one) => one.moduleCode)
    const modulesDoingCodes = user.modulesDoing.map((one) => one.moduleCode)
    const filtered = postReqCodesArr.filter(
      (one) => !modulesDoneCodes.includes(one) && !modulesDoingCodes.includes(one)
    )
    // 4. get modules
    const modules = await ModuleRepository(db).findByCodes(filtered)
    return modules
  }

  /**
   * List mods that will be unlocked by completing a mod.
   *
   * @param {User} user
   * @param {string} moduleCode
   * @return {Promise<Module[] | void>}
   */
  async function getPotentialModules(user: User, moduleCode: string): Promise<Module[] | void> {
    // future support for multiple mods
    const addedModuleCodes = [moduleCode]
    // 1. Return empty array if module in modulesDone or modulesDoing
    await UserRepository(db).loadRelations(user, {
      modulesDone: true,
      modulesDoing: true,
    })
    const modulesDoneCodes = user.modulesDone.map((one) => one.moduleCode)
    const modulesDoingCodes = user.modulesDoing.map((one) => one.moduleCode)
    if (modulesDoneCodes.includes(moduleCode) || modulesDoingCodes.includes(moduleCode))
      return []
    // 2. Get current eligible modules
    const eligibleModules = await UserRepository(db).eligibleModules(user)
    if (!eligibleModules)
      return []
    const eligibleModulesCodes = eligibleModules.map((one) => one.moduleCode)
    // 3. Get potential eligible modules
    const potentialModules = await UserRepository(db).eligibleModules(user, addedModuleCodes)
    if (!potentialModules)
      return []
    // 4. Compare potentialModules to eligibleModules
    const filtered = potentialModules.filter((one) => !eligibleModulesCodes.includes(one.moduleCode))
    return filtered
  }

  /**
   * @param {string} username
   * @return {Promise<User>}
   */
  async function findOneByUsername(username: string): Promise<User> {
    return BaseRepo.createQueryBuilder('user')
      .where('user.username = :username', { username })
      .getOneOrFail()
  }

  /**
   * Returns a User with all relations loaded
   * @param {string} id
   * @return {Promise<User>}
   */
  async function findOneById(id: string): Promise<User> {
    // get user by id
    const user = await BaseRepo.createQueryBuilder('user')
      .where('user.id = :id', { id })
      .getOneOrFail()
    // get relation names
    const relationNames = getRelationNames(db, User)
    await UserRepository(db).loadRelations(user, relationNames)
    return user
  }

  /**
   * Adds an already saved degree to a user.
   * @param {User} user
   * @param {string} degreeId
   * @return {Promise<void>}
   */
  async function addDegree(user: User, degreeId: string): Promise<void> {
    // 1. load savedDegrees relations
    await UserRepository(db).loadRelations(user, {
      savedDegrees: true,
    })
    // 2. find degree in DB
    const degree = await DegreeRepository(db).findOneById(degreeId)
    // 3. append degree
    user.savedDegrees.push(degree)
    await BaseRepo.save(user)
  }

  /**
   * Finds a degree among saved degrees of a user.
   * @param {User} user
   * @param {string} degreeId
   * @return {Promise<Degree>}
   */
  async function findDegree(user: User, degreeId: string): Promise<Degree> {
    // 1. load savedDegrees relations
    await UserRepository(db).loadRelations(user, {
      savedDegrees: true,
    })
    // 2. find degree among user's savedDegrees
    const filtered = user.savedDegrees.filter((degree) => degree.id == degreeId)
    if (filtered.length == 0) throw new Error('Degree not found in User')
    return filtered[0]
  }

  /**
   * Removes a degree among saved degrees of a user.
   * @param {User} user
   * @param {string} degreeId
   * @return {Promise<Degree>}
   */
  async function removeDegree(user: User, degreeId: string): Promise<void> {
    // 1. load savedDegrees relations
    await UserRepository(db).loadRelations(user, {
      savedDegrees: true,
    })
    // 2. find degree among user's savedDegrees
    const filtered = user.savedDegrees.filter((degree) => degree.id != degreeId)
    // 3. find degree among user's savedDegrees
    if (filtered.length == user.savedDegrees.length)
      throw new Error('Degree not found in User')
    // 4. update entity and save
    user.savedDegrees = filtered
    await BaseRepo.save(user)
  }

  return BaseRepo.extend({
    canTakeModule,
    initialize,
    loadRelations,
    findOneByUsername,
    eligibleModules,
    getPostReqs,
    getPotentialModules,
    findOneById,
    addDegree,
    findDegree,
    removeDegree,
  })
}
