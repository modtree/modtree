import { DataSource, In, Repository } from 'typeorm'
import {
  User,
  Module,
  Degree,
  Graph,
  FindByKey,
  IModuleRepository,
  InitUserProps,
  IUser,
  IUserRepository,
  ModuleStatus,
} from '@modtree/types'
import { flatten } from '@modtree/utils'
import {
  getRelationNames,
  useDeleteAll,
  useFindOneByKey,
} from '@modtree/repo-base'
import { ModuleRepository } from '../module'

export class UserRepository
  extends Repository<User>
  implements IUserRepository
{
  private db: DataSource
  private moduleRepo: IModuleRepository
  private degreeRepo: Repository<Degree>
  private graphRepo: Repository<Graph>

  private graphRelations

  constructor(db: DataSource) {
    super(User, db.manager)
    this.db = db
    this.moduleRepo = new ModuleRepository(this.db)
    this.degreeRepo = new Repository(Degree, this.db.manager)
    this.graphRepo = new Repository(Graph, this.db.manager)
    this.graphRelations = getRelationNames(this.graphRepo)
  }

  deleteAll = useDeleteAll(this)
  override findOneById: FindByKey<IUser> = useFindOneByKey(this, 'id')
  findOneByUsername: FindByKey<IUser> = useFindOneByKey(this, 'username')
  findOneByEmail: FindByKey<IUser> = useFindOneByKey(this, 'email')
  findOneByAuthZeroId: FindByKey<IUser> = useFindOneByKey(this, 'authZeroId')

  /**
   * Adds a User to DB
   *
   * @param {InitUserProps} props
   * @returns {Promise<User>}
   */
  async initialize(props: InitUserProps): Promise<User> {
    return Promise.all([
      this.moduleRepo.findByCodes(props.modulesDone || []),
      this.moduleRepo.findByCodes(props.modulesDoing || []),
    ]).then(([modulesDone, modulesDoing]) => {
      const user = this.create({
        ...props,
        displayName: '',
        username: '',
        matriculationYear: 0,
        graduationYear: 0,
        graduationSemester: 0,
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
    return this.degreeRepo.findOneByOrFail({ id: degreeId }).then((degree) => {
      // if the degree is not in saved
      const savedDegreeIds = user.savedDegrees.map((degree) => degree.id)
      if (!savedDegreeIds.includes(degreeId)) {
        throw new Error('Degree not in savedDegrees')
      }
      // set main degree
      user.mainDegree = degree
      return this.save(user)
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
    return this.degreeRepo.findBy({ id: In(degreeIds) }).then((degrees) => {
      // 2. append degrees
      user.savedDegrees.push(...degrees)
      return this.save(user)
    })
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
    return this.graphRepo
      .findOneOrFail({
        where: { id: graphId },
        relations: this.graphRelations,
      })
      .then((graph) => {
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
        user.mainGraph = graph
        return this.save(user)
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
    return this.graphRepo.findBy({ id: In(graphIds) }).then((graphs) => {
      // 2. append graphs
      user.savedGraphs.push(...graphs)
      return this.save(user)
    })
  }

  /**
   * Updates the status of modules for a user.
   *
   * @param {User} user
   * @param {string[]} moduleCodes
   * @param {ModuleStatus} status
   * @return {Promise<User>}
   */
  async setModuleStatus(
    user: User,
    moduleCodes: string[],
    status: ModuleStatus
  ): Promise<User> {
    // 1. remove moduleCode from user if exists
    user.modulesDone = user.modulesDone.filter(
      (m) => !moduleCodes.includes(m.moduleCode)
    )
    user.modulesDoing = user.modulesDoing.filter(
      (m) => !moduleCodes.includes(m.moduleCode)
    )
    // 2. add module to appropriate array (if necessary)
    return Promise.all(
      moduleCodes.map((moduleCode) =>
        this.moduleRepo.findOneByOrFail({ moduleCode })
      )
    ).then((modules) => {
      if (status === ModuleStatus.DONE) {
        user.modulesDone.push(...modules)
      } else if (status === ModuleStatus.DOING) {
        user.modulesDoing.push(...modules)
      } else {
        // ModuleStatus.TAKEN
        // do nothing
      }
      return this.save(user)
    })
  }
}
