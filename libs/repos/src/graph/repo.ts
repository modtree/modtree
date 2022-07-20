import { DataSource } from 'typeorm'
import {
  Module,
  Graph,
  GraphFrontendProps,
  GraphFlowNode,
  ModuleState,
  CanTakeModule,
} from '@modtree/types'
import {
  quickpop,
  flatten,
  getFlowEdges,
  getFlowNodes,
  nodify,
} from '@modtree/utils'
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
     *  get flow edges from relations
     */
    const flowEdges = modules.then(({ modulesPlaced }) =>
      getFlowEdges(modulesPlaced.map(nodify))
    )
    /**
     *  get flow nodes from dagre
     */
    const flowNodes = Promise.all([flowEdges, modules]).then(
      ([edges, { modulesPlaced }]) =>
        getFlowNodes(modulesPlaced.map(nodify), edges)
    )

    /**
     * save the newly created graph
     */
    return Promise.all([user, degree, modules, flowEdges, flowNodes]).then(
      ([user, degree, modules, flowEdges, flowNodes]) =>
        this.save(
          this.create({
            title,
            user,
            degree,
            modulesPlaced: modules.modulesPlaced,
            modulesHidden: modules.modulesHidden,
            flowNodes,
            flowEdges,
          })
        )
    )
  }

  /**
   * @param {string} userId
   * @param {string} degreeId
   * @returns {Promise<Graph>}
   */
  findOneByUserAndDegreeId(userId: string, degreeId: string): Promise<Graph> {
    return this.findOne({
      relations: this.relations,
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
      relations: this.relations,
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
   * Toggle a Module's status between placed and hidden.
   *
   * @param {Graph} graph
   * @param {string} moduleCode
   * @returns {Promise<Graph>}
   */
  async toggleModule(graph: Graph, moduleCode: string): Promise<Graph> {
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
      // remove from flowNodes and flowEdges
      graph.flowNodes = graph.flowNodes.filter((n) => n.id !== moduleCode)
      graph.flowEdges = graph.flowEdges.filter(
        (n) => n.source !== moduleCode && n.target !== moduleCode
      )
      return this.save(graph)
    }
    if (state === 'hidden') {
      toggle(graph.modulesHidden, graph.modulesPlaced)
      return this.save(graph)
    }

    return this.moduleRepo.findByCode(moduleCode).then((module) => {
      graph.modulesPlaced.push(module)
      return this.save(graph)
    })
  }

  /**
   * Updates the frontend part of the Graph
   * note that this method will NOT retrieve any relations.
   * @param {Graph} graph
   * @param {GraphFrontendProps} props
   * @returns {Promise<Graph>}
   */
  async updateFrontendProps(
    graph: Graph,
    props: GraphFrontendProps
  ): Promise<Graph> {
    return this.save({
      ...graph,
      modulesPlaced: props.flowNodes.map((n) => n.data),
      flowEdges: props.flowEdges,
      flowNodes: props.flowNodes,
    })
  }

  /**
   * Updates modules placed of a graph
   *
   * @param {Graph} graph
   * @param {string} moduleCodes
   * @returns {Promise<Graph>}
   */
  async updateModulesPlaced(
    graph: Graph,
    moduleCodes: string[]
  ): Promise<Graph> {
    return this.moduleRepo.findByCodes(moduleCodes).then((modules) =>
      this.save({
        ...graph,
        modulesPlaced: modules,
      })
    )
  }

  /**
   * Updates a single flow node.
   * Expects a full flow node, to replace the current one.
   *
   * @param {Graph} graph
   * @param {GraphFlowNode} node
   * @returns {Promise<Graph>}
   */
  async updateFlowNode(graph: Graph, node: GraphFlowNode): Promise<Graph> {
    const nodeId = node.id
    const index = graph.flowNodes.findIndex((n) => n.id == nodeId)
    if (index === -1) {
      throw new Error('Invalid flow node ID')
    }
    graph.flowNodes[index] = node
    return this.save(graph)
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
    // map to codes
    const modulesPlacedCodes = graph.modulesPlaced.map(flatten.module)
    // remove code of module to test
    const filtered = modulesPlacedCodes.filter((m) => m !== moduleCode)
    return this.moduleRepo.canTakeModule(filtered, [], moduleCode)
  }

  /**
   * Returns true if graph contains sufficient pre-reqs for the module.
   *
   * @param {Graph} graph
   * @returns {Promise<CanTakeModuleMap>}
   */
  async canTakeModules(graph: Graph): Promise<CanTakeModule[]> {
    const moduleCodes = graph.modulesPlaced.map(flatten.module)
    const canTakes = moduleCodes.map((code) => this.canTakeModule(graph, code))
    return Promise.all(canTakes).then((canTakes) =>
      moduleCodes.map((moduleCode, index) => ({
        moduleCode,
        canTake: canTakes[index],
      }))
    )
  }

  /**
   * Updates the title of the graph
   * @param {Graph} graph
   * @param {string} title
   * @returns {Promise<Graph>}
   */
  async rename(graph: Graph, title: string): Promise<Graph> {
    return this.save({
      ...graph,
      title,
    })
  }
}
