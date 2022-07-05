import { DataSource, In, Repository } from 'typeorm'
import {
  Module,
  Graph,
  IModuleRepository,
  IUserRepository,
  IDegreeRepository,
  IGraphRepository,
  FindByKey,
  IGraph,
  GraphFrontendProps,
  GraphFlowNode,
  InitGraphProps,
} from '@modtree/types'
import { quickpop, flatten } from '@modtree/utils'
import { getRelationNames, useDeleteAll, useFindOneByKey } from '../utils'
import { ModuleRepository } from '../module'
import { UserRepository } from '../user'
import { DegreeRepository } from '../degree'
import { getModules } from './get-modules'
import { getFlowEdges } from './get-edges'
import { getFlowNodes, nodify } from './get-nodes'

type ModuleState = 'placed' | 'hidden' | 'new'

export class GraphRepository
  extends Repository<Graph>
  implements IGraphRepository
{
  private db: DataSource
  private allRelations = getRelationNames(this)
  private moduleRepo: IModuleRepository
  private degreeRepo: IDegreeRepository
  private userRepo: IUserRepository

  constructor(db: DataSource) {
    super(Graph, db.manager)
    this.db = db
    this.moduleRepo = new ModuleRepository(this.db)
    this.degreeRepo = new DegreeRepository(this.db)
    this.userRepo = new UserRepository(this.db)
  }

  deleteAll = useDeleteAll(this)
  override findOneById: FindByKey<IGraph> = useFindOneByKey(this, 'id')

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
      getModules(this.moduleRepo, user, degree, props)
    )
    /**
     *  get flow edges from relations
     */
    const flowEdges = modules.then(({ modulesPlaced }) =>
      getFlowEdges(modulesPlaced)
    )
    /**
     *  get flow nodes from dagre
     */
    const flowNodes = Promise.all([flowEdges, modules]).then(
      ([edges, { modulesPlaced }]) => getFlowNodes(modulesPlaced, edges)
    )
    /**
     * save the newly created graph
     */
    return Promise.all([user, degree, modules, flowEdges, flowNodes]).then(
      ([
        user,
        degree,
        { modulesHidden, modulesPlaced },
        flowEdges,
        flowNodes,
      ]) =>
        this.save(
          this.create({
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
      return this.save(graph)
    }
    if (state === 'hidden') {
      toggle(graph.modulesHidden, graph.modulesPlaced)
      return this.save(graph)
    }
    return this.moduleRepo.findOneByOrFail({ moduleCode }).then((module) => {
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
            this.moduleRepo.findOneByOrFail({ moduleCode })
          )
        )
      )
  }

  /**
   * @param {string[]} graphIds
   * @returns {Promise<Graph[]>}
   */
  override async findByIds(graphIds: string[]): Promise<Graph[]> {
    return this.find({
      where: {
        id: In(graphIds),
      },
      relations: this.allRelations,
    })
  }
}
