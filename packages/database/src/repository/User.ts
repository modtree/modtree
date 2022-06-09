import { DataSource } from 'typeorm'
import { InitProps } from '../../types/init-props'
import { User } from '../entity/User'
import { Module } from '../entity/Module'
import { Degree } from '../entity/Degree'
import { getModuleRepository } from './Module'
import { getDegreeRepository } from './Degree'
import { flatten, copy } from '../utils'
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
   * @param {User} user
   * @param {string} moduleCode
   * @returns {Promise<boolean>}
   */
  async function canTakeModule(
    user: User,
    moduleCode: string,
  ): Promise<boolean> {
    const modulesDone = user.modulesDone.map(flatten.module)
    const modulesDoing = user.modulesDoing.map(flatten.module)
    return ModuleRepository.canTakeModule(modulesDone, modulesDoing, moduleCode)
  }

  /**
   * List mods a user can take, based on what the user has completed.
   *
   * @param {User} user
   * @returns {Promise<Module[]>}
   */
  async function getEligibleModules(
    user: User,
  ): Promise<Module[]> {
    // 1. get post-reqs
    const postReqs = await getPostReqs(user)
    if (!postReqs) return []
    // 2. filter post-reqs
    const results = await Promise.all(
      postReqs.map((one) =>
        canTakeModule(user, one.moduleCode)
      )
    )
    const filtered = postReqs.filter((_, idx) => results[idx])
    return filtered
  }

  /**
   * List all post-reqs of a user.
   * This is a union of all post-reqs, subtract modulesDone and modulesDoing.
   *
   * @param {User} user
   * @returns {Promise<Module[]>}
   */
  async function getPostReqs(
    user: User,
  ): Promise<Module[]> {
    const modulesDone = user.modulesDone.map(flatten.module)
    return ModuleRepository
      .getPostReqs(modulesDone)
      .then((res) => filterTakenModules(user, res))
      .then((res) => ModuleRepository.findByCodes(res))
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
    const modulesDone = user.modulesDone.map(flatten.module)
    const modulesDoing = user.modulesDoing.map(flatten.module)
    return ModuleRepository
      .getUnlockedModules(modulesDone, modulesDoing, moduleCode)
      .then((res) => ModuleRepository.findByCodes(res))
  }

  /**
   * Returns true if the moduleCode belongs to a module is in
   * user.modulesDone or user.modulesDoing
   *
   * @param {User} user
   * @param {string} moduleCode
   * @returns {Promise<boolean>}
   */
  async function hasTakenModule(user: User, moduleCode: string): Promise<boolean> {
    // load module relations
    copy(await findOneById(user.id), user)
    const modulesDoneCodes = user.modulesDone.map(flatten.module)
    const modulesDoingCodes = user.modulesDoing.map(flatten.module)
    return (
      modulesDoneCodes.includes(moduleCode) ||
      modulesDoingCodes.includes(moduleCode)
    )
  }

  /**
   * Given moduleCodes, removes modules in user.modulesDone or
   * user.modulesDoing.
   *
   * This is meant to be a util method, so it does not convert
   * module codes
   *
   * @param {User} user
   * @param {string[]} moduleCodes
   * @returns {Promise<string[]>}
   */
  async function filterTakenModules(user: User, moduleCodes: string[]): Promise<string[]> {
    // load module relations
    copy(await findOneById(user.id), user)
    const modulesDoneCodes = user.modulesDone.map(flatten.module)
    const modulesDoingCodes = user.modulesDoing.map(flatten.module)
    const modulesTakenCodes = modulesDoneCodes.concat(modulesDoingCodes)
    // result
    const result = await Promise.all(
      moduleCodes.map((one) => !modulesTakenCodes.includes(one))
    )
    const filtered = moduleCodes.filter((_, idx) => result[idx])
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
    hasTakenModule,
    filterTakenModules,
    findOneById,
    addDegree,
    findDegree,
    deleteAll,
    removeDegree,
  })
}
