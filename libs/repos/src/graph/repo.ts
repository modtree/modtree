import { DataSource } from 'typeorm'
import { Module, Graph, CanTakeModule, ApiResponse } from '@modtree/types'
import { flatten, nodify } from '@modtree/utils'
import { BaseRepo } from '../base'
import { ModuleRepository } from '../module'
import { UserRepository } from '../user'
import { DegreeRepository } from '../degree'
import { getModules } from './get-modules'

export class GraphRepository extends BaseRepo<Graph> {
  private moduleRepo: ModuleRepository
  private degreeRepo: DegreeRepository
  private userRepo: UserRepository

  constructor(db: DataSource) {
    super(Graph, db)
    this.moduleRepo = new ModuleRepository(db)
    this.degreeRepo = new DegreeRepository(db)
    this.userRepo = new UserRepository(db)
  }

  /** one-liners */
  deleteAll = () => this.createQueryBuilder().delete().execute()

  /**
   * Adds a Graph to DB
   *
   * @param {string} title
   * @param {string} userId
   * @param {string} degreeId
   * @returns {Promise<Graph>}
   */
  async initialize(
    title: string,
    userId: string,
    degreeId: string
  ): Promise<Graph> {
    /**
     * fetch user and degree
     */
    const user = this.userRepo.findOneById(userId)
    const degree = this.degreeRepo.findOneById(degreeId)
    /**
     * get all relavant modules, sorted into placed and hidden
     */
    const modules = Promise.all([user, degree]).then(([user, degree]) => {
      return getModules(user, degree)
    })
    /**
     *  get flow nodes from dagre
     */
    const flowNodes = modules.then(({ modulesPlaced }) =>
      modulesPlaced.map((m) => nodify(m, 'planned'))
    )

    /**
     * save the newly created graph
     */
    return Promise.all([user, degree, modules, flowNodes]).then(
      ([user, degree, modules, flowNodes]) =>
        this.save(
          this.create({
            title,
            user,
            degree,
            modulesPlaced: modules.modulesPlaced,
            modulesHidden: modules.modulesHidden,
            flowNodes,
            flowEdges: [],
          })
        )
    )
  }

  /**
   * extracts the parameters for suggestModules
   *
   * @param {Graph} graph
   * @param {string[]} modulesSelected
   * @returns {Promise<[string[], string[], string[], string[]]>}
   */
  async getSuggestModulesParams(
    graph: Graph,
    modulesSelected: string[]
  ): Promise<[string[], string[], string[], string[]]> {
    return Promise.all([
      this.userRepo.findOneById(graph.user.id),
      this.degreeRepo.findOneById(graph.degree.id),
    ]).then(([user, degree]) => {
      const modulesDone = user.modulesDone.map(flatten.module)
      const modulesDoing = user.modulesDoing.map(flatten.module)
      const requiredModules = degree.modules.map(flatten.module)
      return [modulesDone, modulesDoing, modulesSelected, requiredModules]
    })
  }

  /**
   * Suggests modules from a single module.
   * Returns a subset of post-reqs for this module.
   *
   * @param {Graph} graph
   * @param {string[]} modulesSelected
   * @returns {Promise<Module[]>}
   */
  async suggestModules(
    graph: Graph,
    modulesSelected: string[]
  ): Promise<Module[]> {
    return this.getSuggestModulesParams(graph, modulesSelected)
      .then((params) => this.moduleRepo.getSuggestedModules(...params))
      .then((moduleCodes) =>
        Promise.all(
          moduleCodes.map((moduleCode) =>
            this.moduleRepo.findByCode(moduleCode)
          )
        )
      )
  }

  /**
   * Returns true if graph contains sufficient pre-reqs for the module.
   *
   * @param {Graph} graph
   * @param {string} moduleCode
   * @returns {Promise<boolean>}
   */
  async canTakeModule(graph: Graph, moduleCode: string): Promise<boolean> {
    // assume that all existing nodes on the graph are done,
    // except for the code being tested
    const modulesDone = graph.flowNodes
      .map((n) => n.data.moduleCode)
      .filter((m) => m !== moduleCode)
    return this.moduleRepo.canTakeModule(modulesDone, [], moduleCode)
  }

  /**
   * Returns true if graph contains sufficient pre-reqs for the module.
   *
   * @param {Graph} graph
   * @returns {Promise<CanTakeModuleMap>}
   */
  async canTakeModules(graph: Graph): Promise<CanTakeModule[]> {
    return Promise.all(
      graph.flowNodes
        .map((n) => n.data.moduleCode)
        .map((code) =>
          this.canTakeModule(graph, code).then((can) => ({
            moduleCode: code,
            canTake: can,
          }))
        )
    )
  }

  /**
   * update graph and return enough information to replot frontend graph
   *
   * @param {ApiResponse.Graph} frontendGraph
   */
  async update(
    frontendGraph: ApiResponse.Graph
  ): Promise<{ graph: Graph; canTakes: CanTakeModule[] }> {
    /** retrieve graph, update nodes and modules placed */
    const graph = this.findOneById(frontendGraph.id).then((graph) => {
      graph.flowNodes = frontendGraph.flowNodes
      graph.modulesPlaced = frontendGraph.flowNodes.map((n) => n.data)
      return this.save(graph)
    })
    /** calculate can-takes of the new graph */
    const canTakes = graph.then((g) => this.canTakeModules(g))
    return Promise.all([graph, canTakes]).then(([graph, canTakes]) => ({
      graph,
      canTakes,
    }))
  }

  /**
   * find a graph and fetch it with can takes to make it frontend-ready
   */
  async getFrontend(
    graphId: string
  ): Promise<{ graph: Graph; canTakes: CanTakeModule[] }> {
    /** retrieve graph */
    const graph = this.findOneById(graphId)
    /** calculate can-takes of the new graph */
    const canTakes = graph.then((g) => this.canTakeModules(g))
    return Promise.all([graph, canTakes]).then(([graph, canTakes]) => ({
      graph,
      canTakes,
    }))
  }
}
