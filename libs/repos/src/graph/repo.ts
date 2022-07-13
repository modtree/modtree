import { DataSource, In } from 'typeorm'
import {
  Module,
  Graph,
  IModuleRepository,
  IUserRepository,
  IDegreeRepository,
  IGraphRepository,
  GraphFrontendProps,
  GraphFlowNode,
  InitGraphProps,
  ModuleState,
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

export class GraphRepository implements IGraphRepository {
  private moduleRepo: IModuleRepository
  private degreeRepo: IDegreeRepository
  private userRepo: IUserRepository
  private repo: BaseRepo<Graph>

  constructor(db: DataSource) {
    this.repo = new BaseRepo(Graph, db)
    this.moduleRepo = new ModuleRepository(db)
    this.degreeRepo = new DegreeRepository(db)
    this.userRepo = new UserRepository(db)
  }

  async count(): Promise<number> {
    return this.repo.count()
  }

  create(partial: Partial<Graph>): Graph {
    return this.repo.create(partial)
  }

  async save(partial: Partial<Graph>): Promise<Graph> {
    return this.repo.save(partial)
  }

  /** one-liners */
  deleteAll = () => this.repo.createQueryBuilder().delete().execute()

  findOneById = async (id: string) =>
    this.repo.findOneOrFail({ where: { id }, relations: this.repo.relations })

  /**
   * @param {string[]} graphIds
   * @returns {Promise<Graph[]>}
   */
  async findByIds(graphIds: string[]): Promise<Graph[]> {
    return this.repo.find({
      where: {
        id: In(graphIds),
      },
      relations: this.repo.relations,
    })
  }

  /**
   * Adds a Graph to DB
   *
   * @param {InitGraphProps} props
   * @returns {Promise<Graph>}
   */
  async initialize(props: InitGraphProps): Promise<Graph> {
    /**
     * fetch user and degree
     */
    const user = this.userRepo.findOneById(props.userId)
    const degree = this.degreeRepo.findOneById(props.degreeId)
    /**
     * get all relavant modules, sorted into placed and hidden
     */
    const modules = Promise.all([user, degree]).then(([user, degree]) =>
      getModules(user, degree)
    )
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
    return Promise.all([
      props.title,
      user,
      degree,
      modules,
      flowEdges,
      flowNodes,
    ]).then(
      ([
        title,
        user,
        degree,
        { modulesHidden, modulesPlaced },
        flowEdges,
        flowNodes,
      ]) =>
        this.repo.save(
          this.repo.create({
            title,
            user,
            degree,
            modulesPlaced,
            modulesHidden,
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
    return this.repo.findOneOrFail({
      relations: this.repo.relations,
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
    return this.repo.findAndCount({
      relations: this.repo.relations,
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
      return this.repo.save(graph)
    }
    if (state === 'hidden') {
      toggle(graph.modulesHidden, graph.modulesPlaced)
      return this.repo.save(graph)
    }

    return this.moduleRepo.findByCode(moduleCode).then((module) => {
      graph.modulesPlaced.push(module)
      return this.repo.save(graph)
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
    return this.repo.save({
      ...graph,
      flowEdges: props.flowEdges,
      flowNodes: props.flowNodes,
    })
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
    return this.repo.save(graph)
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
}
