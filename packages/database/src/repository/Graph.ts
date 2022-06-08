import { DataSource, In } from 'typeorm'
import { InitProps } from '../../types/init-props'
import { Module } from '../entity/Module'
import { Graph } from '../entity/Graph'
import { getModuleRepository } from './Module'
import { getUserRepository } from './User'
import { getDegreeRepository } from './Degree'
import { Degree } from '../entity/Degree'
import { User } from '../entity/User'
import {
  getDataSource,
  getRelationNames,
  useDeleteAll,
  useFindOneByKey,
} from './base'
import { quickpop, flatten, copy } from '../utils'
import { IGraphRepository } from '../../types/repository'

type ModuleState = 'placed' | 'hidden' | 'new'

/**
 * @param {DataSource} database
 * @returns {GraphRepository}
 */
export function getGraphRepository(database?: DataSource): IGraphRepository {
  const db = getDataSource(database)
  const BaseRepo = db.getRepository(Graph)
  const deleteAll = useDeleteAll(BaseRepo)
  const findOneById = useFindOneByKey(BaseRepo, 'id')
  const allRelations = getRelationNames(BaseRepo)
  const [ModuleRepository, DegreeRepository, UserRepository] = [
    getModuleRepository(db),
    getDegreeRepository(db),
    getUserRepository(db),
  ]

  /**
   * Adds a Graph to DB
   *
   * @param {InitProps['Graph']} props
   * @returns {Promise<Graph>}
   */
  async function initialize(props: InitProps['Graph']): Promise<Graph> {
    /**
     * retrieves the degree and user with relations, without blocking each
     * other.
     */
    async function getUserAndDegree(): Promise<[User, Degree]> {
      const getUser = UserRepository.findOneById(props.userId)
      const getDegree = DegreeRepository.findOneById(props.degreeId)
      return Promise.all([getUser, getDegree])
    }
    const [user, degree] = await getUserAndDegree()

    /**
     * gets lists of modules placed and modules hidden
     *
     * @returns {Promise<Array<Module[]>>}
     */
    async function getModules(): Promise<Array<Module[]>> {
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
          ModuleRepository.findBy({
            moduleCode: In(list),
          })
        )
      )
    }
    const [modulesHidden, modulesPlaced] = await getModules()

    const graph = BaseRepo.create({
      user,
      degree,
      modulesPlaced,
      modulesHidden,
    })
    await BaseRepo.save(graph)
    return graph
  }

  /**
   * Toggle a Module's status between placed and hidden.
   *
   * @param {Graph} graph
   * @param {string} moduleCode
   * @returns {Promise<Graph>}
   */
  async function toggleModule(
    graph: Graph,
    moduleCode: string
  ): Promise<Graph> {
    /**
     * retrieve a Graph from database given its id
     */
    copy(await findOneById(graph.id), graph)
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
      return BaseRepo.save(graph)
    }
    if (state === 'hidden') {
      toggle(graph.modulesHidden, graph.modulesPlaced)
      return BaseRepo.save(graph)
    }
    return ModuleRepository.findOneByOrFail({ moduleCode }).then((module) => {
      graph.modulesPlaced.push(module)
      return BaseRepo.save(graph)
    })
  }

  /**
   * @param {string} userId
   * @param {string} degreeId
   * @returns {Promise<Graph>}
   */
  function findOneByUserAndDegreeId(
    userId: string,
    degreeId: string
  ): Promise<Graph> {
    return BaseRepo.findOneOrFail({
      relations: allRelations,
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
  async function findManyByUserAndDegreeId(
    userId: string,
    degreeId: string
  ): Promise<[Graph[], number]> {
    return BaseRepo.findAndCount({
      relations: allRelations,
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
   * @param {string} moduleCode
   * @returns {Promise<Module[]>}
   */
  async function suggestModules(
    graph: Graph,
    moduleCodes: string[]
  ): Promise<Module[]> {
    // Load relations
    copy(await findOneById(graph.id), graph)
    copy(await DegreeRepository.findOneById(graph.degree.id), graph.degree)

    // 1. Get all post-reqs for this mod
    const postReqs = await UserRepository.getPostReqs(graph.user, moduleCodes, true)
    const postReqsCodes = postReqs.map(flatten.module)

    // 2. Filter for eligible modules
    const allEligibleModules = await UserRepository.getEligibleModules(
      graph.user, []
    )
    if (!allEligibleModules) return [] // temp fix
    const filtered = allEligibleModules.filter((one) =>
      postReqsCodes.includes(one.moduleCode)
    )

    // 3. Transform filtered into data with fields to sort by
    // -- get number of mods each filtered module unlocks
    const resolvedPromises = await Promise.all(
      filtered.map((one) =>
        UserRepository.getUnlockedModules(graph.user, one.moduleCode)
      )
    )
    const unlockedModuleCounts = resolvedPromises.map((one) =>
      one instanceof Array ? one.length : 0
    )
    // -- data processing
    const degreeModulesCodes = graph.degree.modules.map((one) => one.moduleCode)
    type Data = {
      moduleCode: string
      inDegree: boolean
      numUnlockedModules: number
      origIdx: number
    }
    const data = filtered.map(
      (one, origIdx): Data => ({
        moduleCode: one.moduleCode,
        inDegree: degreeModulesCodes.includes(one.moduleCode),
        numUnlockedModules: unlockedModuleCounts[origIdx],
        origIdx,
      })
    )

    /**
     * Sorting comparator
     * higher priority => want smaller final index in the array
     * - if a higher priority, return -1
     * - elif a lower priority, return 1
     * - else return 0
     *
     * @param {Data} a
     * @param {Data} b
     * @returns {number}
     */
    function cmp(a: Data, b: Data): number {
      if (a.inDegree !== b.inDegree) return a.inDegree ? -1 : 1
      if (a.numUnlockedModules !== b.numUnlockedModules)
        return a.numUnlockedModules > b.numUnlockedModules ? -1 : 1
      return a.moduleCode < b.moduleCode ? -1 : 1
    }

    // 4. Sort and rebuild original array
    data.sort(cmp)
    const final = data.map((one) => filtered[one.origIdx])
    return final
  }

  return BaseRepo.extend({
    initialize,
    toggleModule,
    findOneById,
    findOneByUserAndDegreeId,
    findManyByUserAndDegreeId,
    suggestModules,
    deleteAll,
  })
}
