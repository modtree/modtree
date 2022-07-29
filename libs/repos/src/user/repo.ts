import { DataSource, FindOneOptions } from 'typeorm'
import {
  User,
  Module,
  Degree,
  Graph,
  ModuleStatus,
  AuthProvider,
  supportedAuthProviders,
} from '@modtree/types'
import { flatten } from '@modtree/utils'
import { ModuleRepository } from '../module'
import { BaseRepo } from '../base'
import { DegreeRepository } from '../degree'

export class UserRepository extends BaseRepo<User> {
  private moduleRepo: ModuleRepository
  private degreeRepo: DegreeRepository
  private graphRepo: BaseRepo<Graph>
  private loadedFindOne = async (args: FindOneOptions<User>['where']) =>
    this.findOne({ relations: this.relations, where: args })

  constructor(db: DataSource) {
    super(User, db)
    this.moduleRepo = new ModuleRepository(db)
    this.degreeRepo = new DegreeRepository(db)
    this.graphRepo = new BaseRepo(Graph, db)
  }

  /** one-liners */
  deleteAll = () => this.createQueryBuilder().delete().execute()

  /** find one by key, with relations */
  findOneByUsername = (s: string) => this.loadedFindOne({ username: s })
  findOneByEmail = (s: string) => this.loadedFindOne({ email: s })
  findOneByGoogleId = (s: string) => this.loadedFindOne({ googleId: s })
  findOneByGithubId = (s: string) => this.loadedFindOne({ githubId: s })
  findOneByFacebookId = (s: string) => this.loadedFindOne({ facebookId: s })

  /**
   * throws an error on unsupported authentication provider
   */
  checkProvider(provider: string) {
    /** check if provider is valid */
    if (supportedAuthProviders.every((s) => s !== provider)) {
      throw new Error('User Repo: unsupported provider')
    }
  }

  /**
   * Searches database with provider and id
   *
   * @param {AuthProvider} provider
   * @param {string} providerId
   * @returns {Promise<User>} user
   */
  async findOneByProviderId(
    provider: AuthProvider,
    providerId: string
  ): Promise<User> {
    this.checkProvider(provider)
    return {
      google: this.findOneByGoogleId,
      facebook: this.findOneByFacebookId,
      github: this.findOneByGithubId,
      credentials: this.findOneById,
    }[provider as AuthProvider](providerId)
  }

  /**
   * Adds a User to DB
   *
   * @param {string} email
   * @param {string} provider
   * @param {string} providerId
   * @returns {Promise<User>}
   */
  async initialize(
    email: string,
    provider?: string,
    providerId?: string
  ): Promise<User> {
    /** create an empty user first */
    const user = this.create({ email })

    /** set provider if valid */
    if (provider && providerId) {
      this.checkProvider
      this.setProviderId(user, provider, providerId)
    }

    /** set default values */
    user.savedGraphs = []
    user.savedDegrees = []
    user.modulesDone = []
    user.modulesDoing = []

    /** save the user */
    return this.save(user)
  }

  setProviderId(user: User, provider: string, providerId: string): User {
    /** check if provider is valid */
    if (supportedAuthProviders.every((s) => s !== provider)) {
      throw new Error('User.init: unsupported provider')
    }

    /** assign the appropriate id */
    ;({
      google: () => (user.googleId = providerId),
      facebook: () => (user.facebookId = providerId),
      github: () => (user.githubId = providerId),
      credentials: () => {},
    }[provider as AuthProvider]())

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
    const postReqs = this.getPostReqs(user)
    // 2. filter post-reqs
    const results = postReqs.then((postReqs) =>
      Promise.all(postReqs.map((m) => this.canTakeModule(user, m.moduleCode)))
    )
    const filtered = Promise.all([postReqs, results]).then(
      ([postReqs, results]) => postReqs.filter((_, index) => results[index])
    )
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
   * (almost directly pipes input into ModuleRepository's getUnlockedModules method)
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
    const modulesDoneCodes = user.modulesDone.map(flatten.module)
    const modulesDoingCodes = user.modulesDoing.map(flatten.module)
    const modulesTakenCodes = modulesDoneCodes.concat(modulesDoingCodes)
    // result
    const result = moduleCodes.map((code) => !modulesTakenCodes.includes(code))
    const filtered = moduleCodes.filter((_, idx) => result[idx])
    return filtered
  }

  /**
   * Sets the main degree of a user.
   *
   * If the degree is not in savedDegrees, throws error.
   *
   * @param {User} user
   * @param {string} degreeId
   * @returns {Promise<User>}
   */
  async setMainDegree(user: User, degreeId: string): Promise<User> {
    return this.degreeRepo.findOneById(degreeId).then((degree) => {
      // if the degree is not in saved
      const savedDegreeIds = user.savedDegrees.map((degree) => degree.id)
      if (!savedDegreeIds.includes(degreeId)) {
        throw new Error('Degree not in savedDegrees')
      }
      // set main degree
      return this.save({ ...user, mainDegree: degree })
    })
  }

  /**
   * Insert previously saved degrees to a user.
   *
   * @param {User} user
   * @param {string[]} degreeIds
   * @returns {Promise<User>}
   */
  async insertDegrees(user: User, degreeIds: string[]): Promise<User> {
    // 1. find degrees in DB
    return this.degreeRepo.findByIds(degreeIds).then((degrees) =>
      // 2. append degrees
      this.save({
        ...user,
        savedDegrees: [...user.savedDegrees, ...degrees],
      })
    )
  }

  /**
   * Finds a degree among saved degrees of a user.
   *
   * @param {User} user
   * @param {string} degreeId
   * @returns {Promise<Degree>}
   */
  async findDegree(user: User, degreeId: string): Promise<Degree> {
    // find degree among user's savedDegrees
    const res = user.savedDegrees.find((degree) => degree.id === degreeId)
    if (!res) throw new Error('Degree not found in User')
    return res
  }

  /**
   * Removes a degree among saved degrees of a user.
   *
   * @param {User} user
   * @param {string} degreeId
   * @returns {Promise<User>}
   */
  async removeDegree(user: User, degreeId: string): Promise<User> {
    // 1. find degree among user's savedDegrees
    const filtered = user.savedDegrees.filter(
      (degree) => degree.id !== degreeId
    )
    // 2. find degree among user's savedDegrees
    if (filtered.length === user.savedDegrees.length) {
      throw new Error('Degree not found in User')
    }
    // 3. update entity and save
    user.savedDegrees = filtered
    return this.save(user)
  }

  /**
   * Sets the main graph of a user.
   *
   * @param {User} user
   * @param {string} graphId
   * @returns {Promise<User>}
   */
  async setMainGraph(user: User, graphId: string): Promise<User> {
    return this.graphRepo.findOneById(graphId).then((graph) => {
      // if the graph is not in saved
      const savedGraphIds = user.savedGraphs.map((graph) => graph.id)
      if (!savedGraphIds.includes(graphId)) {
        throw new Error('Graph not in savedGraphs')
      }
      // if the graph's degree is not in saved
      const savedDegreeIds = user.savedDegrees.map((degree) => degree.id)
      if (!savedDegreeIds.includes(graph.degree.id)) {
        throw new Error("Graph's degree not in savedDegrees")
      }
      // set main graph
      return this.save({ ...user, mainGraph: graph })
    })
  }

  /**
   * Insert previously saved graphs to a user.
   *
   * @param {User} user
   * @param {string[]} graphIds
   * @returns {Promise<User>}
   */
  async insertGraphs(user: User, graphIds: string[]): Promise<User> {
    // 1. find graphs in DB
    return this.graphRepo.findByIds(graphIds).then((graphs) => {
      return this.save({
        ...user,
        // 2. append graphs
        savedGraphs: [...user.savedGraphs, ...graphs],
      })
    })
  }

  /**
   * Removes a graph among saved graphs of a user.
   *
   * @param {User} user
   * @param {string} graphId
   * @returns {Promise<User>}
   */
  async removeGraph(user: User, graphId: string): Promise<User> {
    // 1. find graph among user's savedGraphs
    const filtered = user.savedGraphs.filter((graph) => graph.id !== graphId)
    // 2. find graph among user's savedGraphs
    if (filtered.length === user.savedGraphs.length) {
      throw new Error('Graph not found in User')
    }
    // 3. update entity and save
    user.savedGraphs = filtered
    return this.save(user)
  }

  /**
   * Sets modulesDone/modulesDoing.
   *
   * @param {User} _user
   * @param {string[]} moduleCodes
   * @param {ModuleStatus} status
   * @return {Promise<User>}
   */
  async setModuleStatus(
    _user: User,
    moduleCodes: string[],
    status: ModuleStatus
  ): Promise<User> {
    /** don't mutate original user passed in */
    const user = this.create(_user)
    return this.moduleRepo.findByCodes(moduleCodes).then((modules) => {
      if (status === ModuleStatus.DONE) {
        user.modulesDone = modules
        // remove from modulesDoing
        user.modulesDoing = user.modulesDoing.filter(
          (m) => !moduleCodes.includes(m.moduleCode)
        )
      } else if (status === ModuleStatus.DOING) {
        user.modulesDoing = modules
        // remove from modulesDone
        user.modulesDone = user.modulesDone.filter(
          (m) => !moduleCodes.includes(m.moduleCode)
        )
      } else {
        // ModuleStatus.NOT_TAKEN
        // remove from modulesDone and modulesDoing
        user.modulesDone = user.modulesDone.filter(
          (m) => !moduleCodes.includes(m.moduleCode)
        )
        user.modulesDoing = user.modulesDoing.filter(
          (m) => !moduleCodes.includes(m.moduleCode)
        )
      }
      return this.save(user)
    })
  }

  /**
   * resets a user
   */
  async reset(user: User) {
    const { email, id } = user
    const fresh = this.create({ email, id })
    return this.save(fresh)
  }
}
