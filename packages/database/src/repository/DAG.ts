import { DataSource, In, SelectQueryBuilder } from 'typeorm'
import { Init, DAGProps } from '../../types/modtree'
import { Module } from '../entity/Module'
import { DAG } from '../entity/DAG'
import { ModuleRepository } from './Module'
import { UserRepository } from './User'
import { DegreeRepository } from './Degree'
import { Degree } from '../entity/Degree'
import { User } from '../entity/User'
import { getDataSource, useBuild, useLoadRelations } from './base'
import { quickpop } from '../utils/array'
import type { DAGRepository as Repository } from '../../types/repository'

type ModuleState = 'placed' | 'hidden' | 'invalid'

/**
 * @param {DataSource} database
 * @return {DAGRepository}
 */
export function DAGRepository(database?: DataSource): Repository {
  const db = getDataSource(database)
  const BaseRepo = db.getRepository(DAG)
  const loadRelations = useLoadRelations(BaseRepo)

  /**
   * Constructor for DAG
   * Note: the props here is slightly different from Init.DAGProps
   * @param {DAGProps} props
   * @return {DAG}
   */
  function build(props: DAGProps): DAG {
    return useBuild(db, DAG, props)
  }

  /**
   * Adds a DAG to DB
   * @param {Init.DAGProps} props
   * @return {Promise<void>}
   */
  async function initialize(props: Init.DAGProps): Promise<void> {
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
        const placed = [...degree.modules]
        placed.push(...user.modulesDone)
        placed.push(...user.modulesDoing)
        return [Array.from(new Set(placed)), []]
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
    const [modulesPlaced, modulesHidden] = await getModules()
    const dag = build({
      user,
      degree,
      modulesPlaced,
      modulesHidden,
    })
    await BaseRepo.save(dag)
  }

  /**
   * Toggle a Module's status between placed and hidden.
   * @param {DAG} dag
   * @param {string} moduleCode
   * @return {Promise<void>}
   */
  async function toggleModule(dag: DAG, moduleCode: string): Promise<void> {
    /**
     * retrieve a DAG from database given its id
     */
    await DAGRepository(db).loadRelations(dag, {
      user: true,
      degree: true,
      modulesPlaced: true,
      modulesHidden: true,
    })
    /**
     * find the index of the given moduleCode to toggle
     */
    const index: Record<ModuleState, number> = {
      placed: dag.modulesPlaced.map((m) => m.moduleCode).indexOf(moduleCode),
      hidden: dag.modulesHidden.map((m) => m.moduleCode).indexOf(moduleCode),
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
      toggle(dag.modulesPlaced, dag.modulesHidden)
    } else if (state === 'hidden') {
      toggle(dag.modulesHidden, dag.modulesPlaced)
    } else {
      // throw error if module not found
      throw new Error('Module not found in DAG')
    }

    await BaseRepo.save(dag)
  }

  /**
   * preliminary function to build up bulk of this query
   * @param {string} userId
   * @param {string} degreeId
   * @return {SelectQueryBuilder<DAG>}
   */
  function queryByUserAndDegreeId(
    userId: string,
    degreeId: string
  ): SelectQueryBuilder<DAG> {
    return BaseRepo.createQueryBuilder('DAG')
      .where('DAG.degree.id = :degreeId', { degreeId })
      .andWhere('DAG.user.id = :userId', { userId })
      .leftJoinAndSelect('DAG.user', 'user')
      .leftJoinAndSelect('DAG.degree', 'degree')
      .leftJoinAndSelect('DAG.modulesPlaced', 'placed')
      .leftJoinAndSelect('DAG.modulesHidden', 'hidden')
  }

  /**
   * @param {string} userId
   * @param {string} degreeId
   * @return {Promise<DAG>}
   */
  async function findOneByUserAndDegreeId(
    userId: string,
    degreeId: string
  ): Promise<DAG> {
    return queryByUserAndDegreeId(userId, degreeId).getOneOrFail()
  }

  /**
   * @param {string} userId
   * @param {string} degreeId
   * @return {Promise<DAG>}
   */
  async function findManyByUserAndDegreeId(
    userId: string,
    degreeId: string
  ): Promise<[DAG[], number]> {
    return queryByUserAndDegreeId(userId, degreeId).getManyAndCount()
  }

  return BaseRepo.extend({
    build,
    initialize,
    toggleModule,
    loadRelations,
    findOneByUserAndDegreeId,
    findManyByUserAndDegreeId,
  })
}
