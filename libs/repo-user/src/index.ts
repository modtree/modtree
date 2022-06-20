import { DataSource, Repository } from 'typeorm'
import { User, Module, Degree } from '@modtree/entity'
import {
  FindByKey,
  IDegreeRepository,
  IModuleRepository,
  InitProps,
  IUser,
  IUserRepository,
  ModuleStatus,
} from '@modtree/types'
import { flatten } from '@modtree/utils'
import { useDeleteAll, useFindOneByKey } from '@modtree/repo-base'
import { ModuleRepository } from '@modtree/repo-module'
import { DegreeRepository } from '@modtree/repo-degree'

export class UserRepository
  extends Repository<User>
  implements IUserRepository
{
  private db: DataSource
  private moduleRepo: IModuleRepository
  private degreeRepo: IDegreeRepository

  constructor(db: DataSource) {
    super(User, db.manager)
    this.db = db
    this.moduleRepo = new ModuleRepository(this.db)
    this.degreeRepo = new DegreeRepository(this.db)
  }

  deleteAll = useDeleteAll(this)
  override findOneById: FindByKey<IUser> = useFindOneByKey(this, 'id')
  findOneByUsername: FindByKey<IUser> = useFindOneByKey(this, 'username')
  findOneByEmail: FindByKey<IUser> = useFindOneByKey(this, 'email')
  findOneByAuthZeroId: FindByKey<IUser> = useFindOneByKey(this, 'authZeroId')

  /**
   * Adds a User to DB
   *
   * @param {InitProps['User']} props
   * @returns {Promise<User>}
   */
  async initialize(props: InitProps['User']): Promise<User> {
    return Promise.all([
      this.moduleRepo.findByCodes(props.modulesDone),
      this.moduleRepo.findByCodes(props.modulesDoing),
    ]).then(([modulesDone, modulesDoing]) => {
      const user = this.create({
        ...props,
        modulesDone,
        modulesDoing,
        savedDegrees: [],
        savedGraphs: [],
      })
      return this.save(user)
    })
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
    const _user = await this.findOneById(user.id)
    const modulesDoneCodes = _user.modulesDone.map(flatten.module)
    const modulesDoingCodes = _user.modulesDoing.map(flatten.module)
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
    const _user = await this.findOneById(user.id)
    const modulesDoneCodes = _user.modulesDone.map(flatten.module)
    const modulesDoingCodes = _user.modulesDoing.map(flatten.module)
    const modulesTakenCodes = modulesDoneCodes.concat(modulesDoingCodes)
    // result
    const result = await Promise.all(
      moduleCodes.map((one) => !modulesTakenCodes.includes(one))
    )
    const filtered = moduleCodes.filter((_, idx) => result[idx])
    return filtered
  }

  /**
   * Adds previously saved degrees to a user.
   *
   * @param {User} user
   * @param {string[]} degreeIds
   * @returns {Promise<User>}
   */
  async addDegrees(user: User, degreeIds: string[]): Promise<User> {
    // 1. load savedDegrees relations
    const _user = await this.findOneById(user.id)
    // 2. find degrees in DB
    const degrees = await this.degreeRepo.findByIds(degreeIds)
    // 3. append degrees
    _user.savedDegrees.push(...degrees)
    return this.save(_user)
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
    const _user = await this.findOneById(user.id)
    // 2. find degree among user's savedDegrees
    const filtered = _user.savedDegrees.filter(
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
    const _user = await this.findOneById(user.id)
    // 2. find degree among user's savedDegrees
    const filtered = _user.savedDegrees.filter(
      (degree) => degree.id !== degreeId
    )
    // 3. find degree among user's savedDegrees
    if (filtered.length === _user.savedDegrees.length) {
      throw new Error('Degree not found in User')
    }
    // 4. update entity and save
    _user.savedDegrees = filtered
    return this.save(_user)
  }

  /**
   * Updates the status of a module for a user.
   *
   * @param {User} user
   * @param {string} moduleCode
   * @param {ModuleStatus} status
   * @return {Promise<User>}
   */
  async setModuleStatus(
    user: User,
    moduleCode: string,
    status: ModuleStatus
  ): Promise<User> {
    // 1. load relations
    const _user = await this.findOneById(user.id)
    // 2. remove moduleCode from user if exists
    _user.modulesDone = _user.modulesDone.filter(
      (one) => one.moduleCode !== moduleCode
    )
    _user.modulesDoing = _user.modulesDoing.filter(
      (one) => one.moduleCode !== moduleCode
    )
    // 3. add module to appropriate array (if necessary)
    if (status === ModuleStatus.DONE) {
      const module = await this.moduleRepo.findOneByOrFail({ moduleCode })
      _user.modulesDone.push(module)
    } else if (status === ModuleStatus.DOING) {
      const module = await this.moduleRepo.findOneByOrFail({ moduleCode })
      _user.modulesDoing.push(module)
    }
    return this.save(_user)
  }
}
