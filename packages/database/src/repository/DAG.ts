import { container } from '../data-source'
import { DataSource, In, Repository } from 'typeorm'
import { DAGInitProps, DAGProps } from '../../types/modtree'
import { Module } from '../entity/Module'
import { DAG } from '../entity/DAG'
import { ModuleRepository } from './Module'
import { UserRepository } from './User'
import { DegreeRepository } from './Degree'
import { db as DefaultSource } from '../config'

interface DAGRepository extends Repository<DAG> {
  build(props: DAGProps): DAG
  initialize(props: DAGInitProps): Promise<void>
  toggleModule(dag: DAG, moduleCode: string): Promise<void>
}

/**
 * @param {DataSource} database
 * @return {DAGRepository}
 */
export function DAGRepository(database?: DataSource): DAGRepository {
  const db = database || DefaultSource
  const BaseRepo = db.getRepository(DAG)

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
      const user = await UserRepository(db).findOne({
        where: {
          id: props.userId,
        },
        relations: ['modulesDone', 'modulesDoing'],
      })
      const degree = await DegreeRepository(db).findOne({
        where: {
          id: props.degreeId,
        },
        relations: ['modules'],
      })
      let modulesPlaced: Module[] = []
      let modulesHidden: Module[] = []
      if (props.pullAll) {
        // if don't pass in anything, then by default add ALL of
        // - user.modulesDoing
        // - user.modulesDone
        // - degree.modules
        const m = [...degree.modules]
        m.push(...user.modulesDone)
        m.push(...user.modulesDoing)
        modulesPlaced = Array.from(new Set(m))
      } else {
        // if passed in, then find the modules
        modulesPlaced = await ModuleRepository(db).findBy({
          moduleCode: In(props.modulesPlacedCodes),
        })
        modulesHidden = await ModuleRepository(db).findBy({
          moduleCode: In(props.modulesHiddenCodes),
        })
      }
      const dagProps = {
        user,
        degree,
        modulesPlaced,
        modulesHidden,
      }
      const dag = build(dagProps)
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
      const retrieved = await BaseRepo.findOne({
        where: {
          id: dag.id,
        },
        relations: ['user', 'degree', 'modulesPlaced', 'modulesHidden'],
      })

      const modulesPlacedCodes = retrieved.modulesPlaced.map(
        (one: Module) => one.moduleCode
      )
      const modulesPlacedIndex = modulesPlacedCodes.indexOf(moduleCode)

      const modulesHiddenCodes = retrieved.modulesHidden.map(
        (one: Module) => one.moduleCode
      )
      const modulesHiddenIndex = modulesHiddenCodes.indexOf(moduleCode)

      if (modulesPlacedIndex != -1) {
        // is a placed module
        const module = retrieved.modulesPlaced[modulesPlacedIndex]

        // O(1) delete
        if (retrieved.modulesPlaced.length > 1)
          retrieved.modulesPlaced[modulesPlacedIndex] =
            retrieved.modulesPlaced.pop()
        else retrieved.modulesPlaced = []

        retrieved.modulesHidden.push(module)
      } else if (modulesHiddenIndex != -1) {
        // is a hidden module
        const module = retrieved.modulesHidden[modulesHiddenIndex]

        if (retrieved.modulesHidden.length > 1)
          retrieved.modulesHidden[modulesHiddenIndex] =
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
  })
}
