import { AppDataSource, container } from '../data-source'
import { In } from 'typeorm'
import { DAGInitProps, DAGProps } from '../../types/modtree'
import { Module } from '../entity/Module'
import { DAG } from '../entity/DAG'
import { ModuleRepository } from './Module'
import { UserRepository } from './User'
import { DegreeRepository } from './Degree'

const Repository = AppDataSource.getRepository(DAG)

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
  await container(async () => {
    const user = await UserRepository.findOne({
      where: {
        id: props.userId,
      },
      relations: ['modulesDone', 'modulesDoing'],
    })
    const degree = await DegreeRepository.findOne({
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

      const modulesPlacedSet = new Set<Module>()
      degree.modules.forEach((one: Module) => {
        modulesPlacedSet.add(one)
      })
      user.modulesDone.forEach((one: Module) => {
        modulesPlacedSet.add(one)
      })
      user.modulesDoing.forEach((one: Module) => {
        modulesPlacedSet.add(one)
      })

      modulesPlaced = Array.from(modulesPlacedSet)
      modulesHidden = []
    } else {
      // if passed in, then find the modules
      modulesPlaced = await ModuleRepository.find({
        where: {
          moduleCode: In(props.modulesPlacedCodes),
        },
      })
      modulesHidden = await ModuleRepository.find({
        where: {
          moduleCode: In(props.modulesHiddenCodes),
        },
      })
    }

    const dagProps = {
      user,
      degree,
      modulesPlaced,
      modulesHidden,
    }
    const dag = build(dagProps)
    await DAGRepository.save(dag)
  })
}

/**
 * Toggle a Module's status between placed and hidden.
 * @param {DAG} dag
 * @param {string} moduleCode
 * @return {Promise<void>}
 */
async function toggleModule(dag: DAG, moduleCode: string): Promise<void> {
  await container(async () => {
    const retrieved = await DAGRepository.findOne({
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
      console.log('Module not found in DAG')
    }

    // update dag so that devs don't need a second query
    dag.modulesPlaced = retrieved.modulesPlaced
    dag.modulesHidden = retrieved.modulesHidden

    return await DAGRepository.save(retrieved)
  })
}

export const DAGRepository = Repository.extend({
  initialize,
  build,
  toggleModule,
})
