import { DataSource } from 'typeorm'
import { InitProps } from '../../types/init-props'
import { User } from '../entity/User'
import { Module } from '../entity/Module'
import { Degree } from '../entity/Degree'
import { getModuleRepository } from './Module'
import { getDegreeRepository } from './Degree'
import { Utils, Flatten, copy } from '../utils'
import {
  getDataSource,
  getRelationNames,
  useDeleteAll,
  useFindOneByKey,
} from './base'
import { IUserRepository } from '../../types/repository'

/**
 * @param {DataSource} database
 * @returns {UserRepository}
 */
export function getUserRepository(database?: DataSource): IUserRepository {
  const db = getDataSource(database)
  const BaseRepo = db.getRepository(User)
  const allRelations = getRelationNames(BaseRepo)
  const deleteAll = useDeleteAll(BaseRepo)
  const findOneById = useFindOneByKey(BaseRepo, 'id')
  const [DegreeRepository, ModuleRepository] = [
    getDegreeRepository(db),
    getModuleRepository(db),
  ]

  /**
   * Adds a User to DB
   *
   * @param {InitProps['User']} props
   * @returns {Promise<User>}
   */
  async function initialize(props: InitProps['User']): Promise<User> {
    // find modules completed and modules doing, to create many-to-many
    // relation
    const queryList = [props.modulesDone, props.modulesDoing]
    const modulesPromise = Promise.all(
      queryList.map((list) => ModuleRepository.findByCodes(list))
    )
    const [modulesDone, modulesDoing] = await modulesPromise
    const user = BaseRepo.create({
      ...props,
      modulesDone: modulesDone || [],
      modulesDoing: modulesDoing || [],
      savedDegrees: [],
      savedGraphs: [],
    })
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
   * @returns {Promise<boolean>}
   */
  async function canTakeModule(
    user: User,
    moduleCode: string,
    addedModuleCodes?: string[]
  ): Promise<boolean> {
    // 1. find module
    const module = await ModuleRepository.findOneBy({ moduleCode })
    // -- if module not found, assume invalid module code
    if (!module) return false
    // 2. load modulesDone and modulesDoing relations
    copy(await findOneById(user.id), user)
    // -- if module already taken, can't take module again
    const modulesDoneCodes = user.modulesDone.map(Flatten.module)
    const modulesDoingCodes = user.modulesDoing.map(Flatten.module)
    // -- add some module codes to done modules
    if (addedModuleCodes && addedModuleCodes.length > 0) {
      addedModuleCodes.forEach((one) => {
        // ignore duplicates
        if (
          !modulesDoneCodes.includes(one) &&
          !modulesDoingCodes.includes(one)
        ) {
          modulesDoneCodes.push(one)
        }
      })
    }
    if (
      modulesDoneCodes.includes(moduleCode) ||
      modulesDoingCodes.includes(moduleCode)
    ) {
      return false
    }
    // 3. check if PrereqTree is fulfilled
    return Utils.checkTree(module.prereqTree, modulesDoneCodes)
  }
  /**
   * List mods a user can take, based on what the user has completed.
   *
   * If optional string[] addedModuleCodes is specified, then each of the modules
   * are taken as done, and passed into User.canTakeModule.
   *
   * @param {User} user
   * @param {string[]} addedModuleCodes
   * @returns {Promise<Module[]>}
   */
  async function getEligibleModules(
    user: User,
    addedModuleCodes?: string[]
  ): Promise<Module[]> {
    // if undefined
    if (!addedModuleCodes) {
      addedModuleCodes = []
    }
    // 1. get post-reqs
    const postReqs = await getPostReqs(user, addedModuleCodes)
    if (!postReqs) return []
    // 2. filter post-reqs
    const promises = postReqs.map((one) =>
      canTakeModule(user, one.moduleCode, addedModuleCodes)
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
   * @returns {Promise<Module[]>}
   */
  async function getPostReqs(
    user: User,
    addedModuleCodes?: string[]
  ): Promise<Module[]> {
    // if undefined
    if (!addedModuleCodes) {
      addedModuleCodes = []
    }
    // 1. load modulesDone and modulesDoing relations
    copy(await findOneById(user.id), user)
    // 2. get array of module codes of post-reqs (fulfillRequirements)
    const postReqCodesSet = new Set<string>()
    user.modulesDone.forEach((module: Module) => {
      // can be empty string
      if (module.fulfillRequirements instanceof Array) {
        module.fulfillRequirements.forEach((moduleCode: string) => {
          postReqCodesSet.add(moduleCode)
        })
      }
    })
    const addedModules = await Promise.all(
      addedModuleCodes.map((one) =>
        ModuleRepository.findOneBy({
          moduleCode: one,
        })
      )
    )
    addedModules.forEach((module: Module) => {
      // can be empty string
      if (module.fulfillRequirements instanceof Array) {
        module.fulfillRequirements.forEach((moduleCode: string) => {
          postReqCodesSet.add(moduleCode)
        })
      }
    })
    const postReqCodesArr = Array.from(postReqCodesSet)
    // 3. filter modulesDone and modulesDoing
    const modulesDoneCodes = user.modulesDone.map(Flatten.module)
    const modulesDoingCodes = user.modulesDoing.map(Flatten.module)
    const filtered = postReqCodesArr.filter(
      (one) =>
        !modulesDoneCodes.includes(one) && !modulesDoingCodes.includes(one)
    )
    // 4. get modules
    const modules = await ModuleRepository.findByCodes(filtered)
    return modules
  }

  /**
   * List mods that will be unlocked by completing a mod.
   *
   * @param {User} user
   * @param {string} moduleCode
   * @returns {Promise<Module[]>}
   */
  async function getUnlockedModules(
    user: User,
    moduleCode: string
  ): Promise<Module[]> {
    // future support for multiple mods
    const addedModuleCodes = [moduleCode]
    // 1. Return empty array if module in modulesDone or modulesDoing
    copy(await findOneById(user.id), user)
    const modulesDoneCodes = user.modulesDone.map((one) => one.moduleCode)
    const modulesDoingCodes = user.modulesDoing.map((one) => one.moduleCode)
    if (
      modulesDoneCodes.includes(moduleCode) ||
      modulesDoingCodes.includes(moduleCode)
    ) {
      return []
    }
    // 2. Get current eligible modules
    const eligibleModules = await getEligibleModules(user)
    if (!eligibleModules) return []
    const eligibleModulesCodes = eligibleModules.map(Flatten.module)
    // 3. Get unlocked eligible modules
    const unlockedModules = await getEligibleModules(user, addedModuleCodes)
    if (!unlockedModules) {
      return []
    }
    // 4. Compare unlockedModules to eligibleModules
    const filtered = unlockedModules.filter(
      (one) => !eligibleModulesCodes.includes(one.moduleCode)
    )
    return filtered
  }

  /**
   * @param {string} username
   * @returns {Promise<User>}
   */
  async function findOneByUsername(username: string): Promise<User> {
    return BaseRepo.findOneOrFail({
      where: { username },
      relations: allRelations,
    })
  }

  /**
   * Adds an already saved degree to a user.
   *
   * @param {User} user
   * @param {string} degreeId
   * @returns {Promise<void>}
   */
  async function addDegree(user: User, degreeId: string): Promise<void> {
    // 1. load savedDegrees relations
    copy(await findOneById(user.id), user)
    // 2. find degree in DB
    const degree = await DegreeRepository.findOneById(degreeId)
    // 3. append degree
    user.savedDegrees.push(degree)
    await BaseRepo.save(user)
  }

  /**
   * Finds a degree among saved degrees of a user.
   *
   * @param {User} user
   * @param {string} degreeId
   * @returns {Promise<Degree>}
   */
  async function findDegree(user: User, degreeId: string): Promise<Degree> {
    // 1. load savedDegrees relations
    copy(await findOneById(user.id), user)
    // 2. find degree among user's savedDegrees
    const filtered = user.savedDegrees.filter(
      (degree) => degree.id === degreeId
    )
    if (filtered.length === 0) throw new Error('Degree not found in User')
    return filtered[0]
  }

  /**
   * Removes a degree among saved degrees of a user.
   *
   * @param {User} user
   * @param {string} degreeId
   * @returns {Promise<void>}
   */
  async function removeDegree(user: User, degreeId: string): Promise<void> {
    // 1. load savedDegrees relations
    copy(await findOneById(user.id), user)
    // 2. find degree among user's savedDegrees
    const filtered = user.savedDegrees.filter(
      (degree) => degree.id !== degreeId
    )
    // 3. find degree among user's savedDegrees
    if (filtered.length === user.savedDegrees.length) {
      throw new Error('Degree not found in User')
    }
    // 4. update entity and save
    user.savedDegrees = filtered
    await BaseRepo.save(user)
  }

  return BaseRepo.extend({
    canTakeModule,
    initialize,
    findOneByUsername,
    getEligibleModules,
    getPostReqs,
    getUnlockedModules,
    findOneById,
    addDegree,
    findDegree,
    deleteAll,
    removeDegree,
  })
}
