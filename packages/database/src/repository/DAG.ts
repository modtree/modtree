import { container } from '../data-source'
import { DataSource, In, Repository } from 'typeorm'
import { DAGInitProps, DAGProps } from '../../types/modtree'
import { Module } from '../entity/Module'
import { DAG } from '../entity/DAG'
import { ModuleRepository } from './Module'
import { UserRepository } from './User'
import { DegreeRepository } from './Degree'
import { Degree } from '../entity/Degree'
import { User } from '../entity/User'
import { db as DefaultSource } from '../config'
import { LoadRelations, useLoadRelations } from './base'

interface DAGRepository extends Repository<DAG> {
  build(props: DAGProps): DAG
  initialize(props: DAGInitProps): Promise<void>
  toggleModule(dag: DAG, moduleCode: string): Promise<void>
  loadRelations: LoadRelations<DAG>
}

/**
 * @param {DataSource} database
 * @return {DAGRepository}
 */
export function DAGRepository(database?: DataSource): DAGRepository {
  const db = database || DefaultSource
  const BaseRepo = db.getRepository(DAG)
  const loadRelations = useLoadRelations(BaseRepo)

  /**
   * Constructor for DAG
   * Note: the props here is slightly different from DAGInitProps
   * @param {DAGProps} props
   * @return {DAG}
   */
  function build(props: DAGProps): DAG {
    const dag = new DAG()
    dag.user = props.user
    dag.degree = props.degree
    dag.modulesPlaced = props.modulesPlaced || []
    dag.modulesHidden = props.modulesHidden || []
    return dag
  }

  /**
   * Adds a DAG to DB
   * @param {DAGInitProps} props
   * @return {Promise<void>}
   */
  async function initialize(props: DAGInitProps): Promise<void> {
    await container(db, async () => {
      /**
       * retrieves the degree and user with relations, without blocking each
       * other.
       */
      async function getUserAndDegree(): Promise<[User, Degree]> {
        const getUser = UserRepository(db).findOne({
          where: {
            id: props.userId,
          },
          relations: {
            modulesDoing: true,
            modulesDone: true,
          },
        })
        const getDegree = DegreeRepository(db).findOne({
          where: {
            id: props.degreeId,
          },
          relations: { modules: true },
        })
        // return [user, degree]
        return await Promise.all([getUser, getDegree])
      }

      async function getModules(): Promise<Module[][]> {
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
        return await Promise.all(
          [props.modulesPlacedCodes, props.modulesHiddenCodes].map((list) =>
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
    })
  }

  /**
   * Toggle a Module's status between placed and hidden.
   * @param {DAG} dag
   * @param {string} moduleCode
   * @return {Promise<void>}
   */
  async function toggleModule(dag: DAG, moduleCode: string): Promise<void> {
    await container(db, async () => {
      /**
       * retrieve a DAG from database given its id
       */
      const retrieved = await BaseRepo.findOne({
        where: {
          id: dag.id,
        },
        relations: {
          user: true,
          degree: true,
          modulesPlaced: true,
          modulesHidden: true,
        },
      })
      const [modulesPlaced, modulesHidden] = [
        retrieved.modulesPlaced,
        retrieved.modulesHidden,
      ]
      /**
       * find the index of the given moduleCode to toggle
       */
      const index = {
        placed: modulesPlaced.map((m) => m.moduleCode).indexOf(moduleCode),
        hidden: modulesHidden.map((m) => m.moduleCode).indexOf(moduleCode),
      }
      const currentStatus = index.placed === -1 ? 'placed' : 'hidden'

      /**
       * O(1) delete from unsorted array
       */
      function quickpop(arr: Module[], index: number) {
        const elem = arr.pop()
        if (arr.length > index + 1) arr[index] = elem
      }

      if (index.placed != -1) {
        // is a placed module
        const module = retrieved.modulesPlaced[index.placed]
        quickpop(retrieved.modulesPlaced, index.placed)

        retrieved.modulesHidden.push(module)
      } else if (index.hidden != -1) {
        // is a hidden module
        const module = retrieved.modulesHidden[index.hidden]

        if (retrieved.modulesHidden.length > 1)
          retrieved.modulesHidden[index.hidden] =
            retrieved.modulesHidden.pop()
        // O(1) delete
        else retrieved.modulesHidden = []

        retrieved.modulesPlaced.push(module)
      } else {
        // throw error if module not found
        throw new Error('Module not found in DAG')
      }

      // update dag so that devs don't need a second query
      dag.modulesPlaced = retrieved.modulesPlaced
      dag.modulesHidden = retrieved.modulesHidden

      return await BaseRepo.save(retrieved)
    })
  }

  return BaseRepo.extend({
    build,
    initialize,
    toggleModule,
    loadRelations,
  })
}
