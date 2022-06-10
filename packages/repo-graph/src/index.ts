import { DataSource, In, Repository } from 'typeorm'
import { Module, Graph, User, Degree } from '@modtree/entity'
import {
  InitProps,
  IModuleRepository,
  IUserRepository,
  IDegreeRepository,
} from '@modtree/types'
import { quickpop, flatten, copy } from '@modtree/utils'
import {
  getRelationNames,
  useDeleteAll,
  useFindOneByKey,
} from '@modtree/repo-base'
import { ModuleRepository } from '@modtree/repo-module'
import { UserRepository } from '@modtree/repo-user'
import { DegreeRepository } from '@modtree/repo-degree'

type ModuleState = 'placed' | 'hidden' | 'new'

export class GraphRepository extends Repository<Graph> {
  private db: DataSource
  private allRelations = getRelationNames(this)
  private ModuleRepository: IModuleRepository
  private DegreeRepository: IDegreeRepository
  private UserRepository: IUserRepository

  constructor(db: DataSource) {
    super(Graph, db.manager)
    this.db = db
    this.ModuleRepository = new ModuleRepository(this.db)
    this.DegreeRepository = new DegreeRepository(this.db)
    this.UserRepository = new UserRepository(this.db)
  }

  deleteAll = useDeleteAll(this)
  findOneById = useFindOneByKey(this, 'id')

  /**
   * retrieves the degree and user with relations, without blocking each
   * other.
   */
  private async getUserAndDegree(
    props: InitProps['Graph']
  ): Promise<[User, Degree]> {
    const getUser = this.UserRepository.findOneById(props.userId)
    const getDegree = this.DegreeRepository.findOneById(props.degreeId)
    return Promise.all([getUser, getDegree])
  }

  /**
   * gets lists of modules placed and modules hidden
   *
   * @returns {Promise<Array<Module[]>>}
   */
  private async Modules(
    user: User,
    degree: Degree,
    props: InitProps['Graph']
  ): Promise<Array<Module[]>> {
    if (props.pullAll) {
      /* if don't pass in anything, then by default add ALL of
       * - user.modulesDoing
       * - user.modulesDone
       * - degree.modules
       */
      const hidden = [...degree.modules]
      hidden.push(...user.modulesDone)
      hidden.push(...user.modulesDoing)
      return [Array.from(new Set(hidden)), []]
    }
    // if passed in, then find the modules
    const queryList = [props.modulesPlacedCodes, props.modulesHiddenCodes]
    return Promise.all(
      queryList.map((list) =>
        this.ModuleRepository.findBy({
          moduleCode: In(list),
        })
      )
    )
  }

  /**
   * Adds a Graph to DB
   *
   * @param {InitProps['Graph']} props
   * @returns {Promise<Graph>}
   */
  async initialize(props: InitProps['Graph']): Promise<Graph> {
    const [user, degree] = await this.getUserAndDegree(props)
    const [modulesHidden, modulesPlaced] = await this.Modules(
      user,
      degree,
      props
    )
    return this.save(
      this.create({
        user,
        degree,
        modulesPlaced,
        modulesHidden,
      })
    )
  }

  /**
   * Toggle a Module's status between placed and hidden.
   *
   * @param {Graph} graph
   * @param {string} moduleCode
   * @returns {Promise<Graph>}
   */
  async toggleModule(graph: Graph, moduleCode: string): Promise<Graph> {
    /**
     * retrieve a Graph from database given its id
     */
    copy(await this.findOneById(graph.id), graph)
    /**
     * find the index of the given moduleCode to toggle
     */
    const index: Record<ModuleState, number> = {
      placed: graph.modulesPlaced.map(flatten.module).indexOf(moduleCode),
      hidden: graph.modulesHidden.map(flatten.module).indexOf(moduleCode),
      new: -1,
    }
    /**
     * @returns {ModuleState}
     */
    function getState(): ModuleState {
      if (index.placed !== -1) return 'placed'
      if (index.hidden !== -1) return 'hidden'
      return 'new'
    }
    const state = getState()

    /**
     * toggles the modules between placed and hidden
     * if the module is not found, append it to placed
     *
     * @param {Module[]} src
     * @param {Module[]} dest
     */
    function toggle(src: Module[], dest: Module[]) {
      dest.push(quickpop(src, index[state]))
    }

    if (state === 'placed') {
      toggle(graph.modulesPlaced, graph.modulesHidden)
      return this.save(graph)
    }
    if (state === 'hidden') {
      toggle(graph.modulesHidden, graph.modulesPlaced)
      return this.save(graph)
    }
    return this.ModuleRepository.findOneByOrFail({ moduleCode }).then(
      (module) => {
        graph.modulesPlaced.push(module)
        return this.save(graph)
      }
    )
  }

  /**
   * @param {string} userId
   * @param {string} degreeId
   * @returns {Promise<Graph>}
   */
  findOneByUserAndDegreeId(userId: string, degreeId: string): Promise<Graph> {
    return this.findOneOrFail({
      relations: this.allRelations,
      where: {
        user: {
          id: userId,
        },
        degree: {
          id: degreeId,
        },
      },
    })
  }

  /**
   * @param {string} userId
   * @param {string} degreeId
   * @returns {Promise<Graph>}
   */
  async findManyByUserAndDegreeId(
    userId: string,
    degreeId: string
  ): Promise<[Graph[], number]> {
    return this.findAndCount({
      relations: this.allRelations,
      where: {
        user: {
          id: userId,
        },
        degree: {
          id: degreeId,
        },
      },
    })
  }

  /**
   * Suggests modules from a single module.
   * Returns a subset of post-reqs for this module.
   *
   * @param {Graph} graph
   * @param {string[]} moduleCodes
   * @returns {Promise<Module[]>}
   */
  async suggestModules(graph: Graph, moduleCodes: string[]): Promise<Module[]> {
    // Load relations
    copy(await this.findOneById(graph.id), graph)
    copy(await this.DegreeRepository.findOneById(graph.degree.id), graph.degree)
    copy(await this.UserRepository.findOneById(graph.user.id), graph.user)
    // Get data
    const modulesDone = graph.user.modulesDone.map(flatten.module)
    const modulesDoing = graph.user.modulesDoing.map(flatten.module)
    const modulesSelected = moduleCodes
    const requiredModules = graph.degree.modules.map(flatten.module)
    // Results
    const res = await this.ModuleRepository.getSuggestedModules(
      modulesDone,
      modulesDoing,
      modulesSelected,
      requiredModules
    )
    const modules = await Promise.all(
      res.map((moduleCode) => this.ModuleRepository.findOneBy({ moduleCode }))
    )
    return modules
  }
}
