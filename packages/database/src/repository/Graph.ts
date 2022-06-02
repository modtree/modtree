import { DataSource, In, SelectQueryBuilder } from 'typeorm'
import { Init } from '../../types/entity'
import { Module } from '../entity/Module'
import { Graph } from '../entity/Graph'
import { ModuleRepository } from './Module'
import { UserRepository } from './User'
import { DegreeRepository } from './Degree'
import { Degree } from '../entity/Degree'
import { User } from '../entity/User'
import { getDataSource, useLoadRelations } from './base'
import { quickpop } from '../utils/array'
import type { GraphRepository as Repository } from '../../types/repository'

type ModuleState = 'placed' | 'hidden' | 'invalid'

/**
 * @param {DataSource} database
 * @return {GraphRepository}
 */
export function GraphRepository(database?: DataSource): Repository {
  const db = getDataSource(database)
  const BaseRepo = db.getRepository(Graph)
  const loadRelations = useLoadRelations(BaseRepo)

  /**
   * Adds a Graph to DB
   * @param {Init.GraphProps} props
   * @return {Promise<Graph>}
   */
  async function initialize(props: Init.GraphProps): Promise<Graph> {
    /**
     * retrieves the degree and user with relations, without blocking each
     * other.
     */
    async function getUserAndDegree(): Promise<[User, Degree]> {
      const getUser = UserRepository(db).findOneById(props.userId)
      const getDegree = DegreeRepository(db).findOneById(props.degreeId)
      return await Promise.all([getUser, getDegree])
    }

    /**
     * gets lists of modules placed and modules hidden
     * @return {Promise<Array<Module[]>>}
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
      return await Promise.all(
        queryList.map((list) =>
          ModuleRepository(db).findBy({
            moduleCode: In(list),
          })
        )
      )
    }

    const [user, degree] = await getUserAndDegree()
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
   * @param {Graph} graph
   * @param {string} moduleCode
   * @return {Promise<void>}
   */
  async function toggleModule(graph: Graph, moduleCode: string): Promise<void> {
    /**
     * retrieve a Graph from database given its id
     */
    await GraphRepository(db).loadRelations(graph, {
      user: true,
      degree: true,
      modulesPlaced: true,
      modulesHidden: true,
    })
    /**
     * find the index of the given moduleCode to toggle
     */
    const index: Record<ModuleState, number> = {
      placed: graph.modulesPlaced.map((m) => m.moduleCode).indexOf(moduleCode),
      hidden: graph.modulesHidden.map((m) => m.moduleCode).indexOf(moduleCode),
      invalid: -1,
    }
    const state: ModuleState =
      index.placed !== -1
        ? 'placed'
        : index.hidden !== -1
        ? 'hidden'
        : 'invalid'

    /**
     * toggles the modules between placed and hidden
     * @param {Module[]} src
     * @param {Module[]} dest
     */
    function toggle(src: Module[], dest: Module[]) {
      dest.push(quickpop(src, index[state]))
    }

    /**
     * toggles the modules between placed and hidden
     */
    if (state === 'placed') {
      toggle(graph.modulesPlaced, graph.modulesHidden)
    } else if (state === 'hidden') {
      toggle(graph.modulesHidden, graph.modulesPlaced)
    } else {
      // throw error if module not found
      throw new Error('Module not found in Graph')
    }

    await BaseRepo.save(graph)
  }

  /**
   * preliminary function to build up bulk of this query
   * @param {string} userId
   * @param {string} degreeId
   * @return {SelectQueryBuilder<Graph>}
   */
  function queryByUserAndDegreeId(
    userId: string,
    degreeId: string
  ): SelectQueryBuilder<Graph> {
    return BaseRepo.createQueryBuilder('Graph')
      .where('Graph.degree.id = :degreeId', { degreeId })
      .andWhere('Graph.user.id = :userId', { userId })
      .leftJoinAndSelect('Graph.user', 'user')
      .leftJoinAndSelect('Graph.degree', 'degree')
      .leftJoinAndSelect('Graph.modulesPlaced', 'placed')
      .leftJoinAndSelect('Graph.modulesHidden', 'hidden')
  }

  /**
   * @param {string} userId
   * @param {string} degreeId
   * @return {Promise<Graph>}
   */
  async function findOneByUserAndDegreeId(
    userId: string,
    degreeId: string
  ): Promise<Graph> {
    return queryByUserAndDegreeId(userId, degreeId).getOneOrFail()
  }

  /**
   * @param {string} userId
   * @param {string} degreeId
   * @return {Promise<Graph>}
   */
  async function findManyByUserAndDegreeId(
    userId: string,
    degreeId: string
  ): Promise<[Graph[], number]> {
    return queryByUserAndDegreeId(userId, degreeId).getManyAndCount()
  }

  return BaseRepo.extend({
    initialize,
    toggleModule,
    loadRelations,
    findOneByUserAndDegreeId,
    findManyByUserAndDegreeId,
  })
}
