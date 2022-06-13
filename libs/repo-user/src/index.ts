import { DataSource, Repository } from 'typeorm'
import { User, Module, Degree } from '@modtree/entity'
import {
  FindOneById,
  IDegreeRepository,
  IModuleRepository,
  InitProps,
  IUser,
  IUserRepository,
} from '@modtree/types'
import { flatten, copy } from '@modtree/utils'
import {
  getRelationNames,
  useDeleteAll,
  useFindOneByKey,
} from '@modtree/repo-base'
import { ModuleRepository } from '@modtree/repo-module'
import { DegreeRepository } from '@modtree/repo-degree'

export class UserRepository
  extends Repository<User>
  implements IUserRepository
{
  private db: DataSource
  private allRelations = getRelationNames(this)
  private moduleRepo: IModuleRepository
  private degreeRepo: IDegreeRepository

  constructor(db: DataSource) {
    super(User, db.manager)
    this.db = db
    this.moduleRepo = new ModuleRepository(this.db)
    this.degreeRepo = new DegreeRepository(this.db)
  }

  deleteAll = useDeleteAll(this)
  override findOneById: FindOneById<IUser> = useFindOneByKey(this, 'id')

  /**
   * Adds a User to DB
   *
   * @param {InitProps['User']} props
   * @returns {Promise<User>}
   */
  async initialize(props: InitProps['User']): Promise<User> {
    // find modules completed and modules doing, to create many-to-many
    // relation
    const queryList = [props.modulesDone, props.modulesDoing]
    const modulesPromise = Promise.all(
      queryList.map((list) => this.moduleRepo.findByCodes(list))
    )
    const [modulesDone, modulesDoing] = await modulesPromise
    const user = this.create({
      ...props,
      modulesDone: modulesDone || [],
      modulesDoing: modulesDoing || [],
      savedDegrees: [],
      savedGraphs: [],
    })
    return this.save(user)
  }

  /**
   * Given a module code, checks if user has cleared sufficient pre-requisites.
   * Currently does not check for preclusion.
   *
   * @param {User} user
   * @param {string} moduleCode
   * @returns {Promise<boolean>}
   */
  async canTakeModule(user: User, moduleCode: string): Promise<boolean> {
    const modulesDone = user.modulesDone.map(flatten.module)
    const modulesDoing = user.modulesDoing.map(flatten.module)
    return this.moduleRepo.canTakeModule(modulesDone, modulesDoing, moduleCode)
  }

  /**
   * List mods a user can take, based on what the user has completed.
   *
   * @param {User} user
   * @returns {Promise<Module[]>}
   */
  async getEligibleModules(user: User): Promise<Module[]> {
    // 1. get post-reqs
    const postReqs = await this.getPostReqs(user)
    if (!postReqs) return []
    // 2. filter post-reqs
    const results = await Promise.all(
      postReqs.map((one) => this.canTakeModule(user, one.moduleCode))
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
  async getPostReqs(user: User): Promise<Module[]> {
    const modulesDone = user.modulesDone.map(flatten.module)
    return this.moduleRepo
      .getPostReqs(modulesDone)
      .then((res) => this.filterTakenModules(user, res))
      .then((res) => this.moduleRepo.findByCodes(res))
  }

  /**
   * List mods that will be unlocked by completing a mod.
   *
   * @param {User} user
   * @param {string} moduleCode
   * @returns {Promise<Module[]>}
   */
  async getUnlockedModules(user: User, moduleCode: string): Promise<Module[]> {
    const modulesDone = user.modulesDone.map(flatten.module)
    const modulesDoing = user.modulesDoing.map(flatten.module)
    return this.moduleRepo
      .getUnlockedModules(modulesDone, modulesDoing, moduleCode)
      .then((res) => this.moduleRepo.findByCodes(res))
  }

  /**
   * Returns true if the moduleCode belongs to a module is in
   * user.modulesDone or user.modulesDoing
   *
   * @param {User} user
   * @param {string} moduleCode
   * @returns {Promise<boolean>}
   */
  async hasTakenModule(user: User, moduleCode: string): Promise<boolean> {
    // load module relations
    copy(await this.findOneById(user.id), user)
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
  async filterTakenModules(
    user: User,
    moduleCodes: string[]
  ): Promise<string[]> {
    // load module relations
    copy(await this.findOneById(user.id), user)
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
  async findOneByUsername(username: string): Promise<User> {
    return this.findOneOrFail({
      where: { username },
      relations: this.allRelations,
    })
  }

  /**
   * Adds an already saved degree to a user.
   *
   * @param {User} user
   * @param {string} degreeId
   * @returns {Promise<User>}
   */
  async addDegree(user: User, degreeId: string): Promise<User> {
    // 1. load savedDegrees relations
    copy(await this.findOneById(user.id), user)
    // 2. find degree in DB
    const degree = await this.degreeRepo.findOneById(degreeId)
    // 3. append degree
    user.savedDegrees.push(degree)
    return this.save(user)
  }

  /**
   * Finds a degree among saved degrees of a user.
   *
   * @param {User} user
   * @param {string} degreeId
   * @returns {Promise<Degree>}
   */
  async findDegree(user: User, degreeId: string): Promise<Degree> {
    // 1. load savedDegrees relations
    copy(await this.findOneById(user.id), user)
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
   * @returns {Promise<User>}
   */
  async removeDegree(user: User, degreeId: string): Promise<User> {
    // 1. load savedDegrees relations
    copy(await this.findOneById(user.id), user)
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
    return this.save(user)
  }
}
