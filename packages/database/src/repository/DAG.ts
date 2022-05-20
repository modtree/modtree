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
 * @param {string} moduleCode
 */
async function toggleModule(thisDag: DAG, moduleCode: string): Promise<DAG> {
  const res = await container(async () => {
    const dag = await DAGRepository.findOne({
      where: {
        id: thisDag.id,
      },
      relations: ['user', 'degree', 'modulesPlaced', 'modulesHidden'],
    })

    const modulesPlacedCodes = dag.modulesPlaced.map(
      (one: Module) => one.moduleCode
    )
    const modulesPlacedIndex = modulesPlacedCodes.indexOf(moduleCode)

    const modulesHiddenCodes = dag.modulesHidden.map(
      (one: Module) => one.moduleCode
    )
    const modulesHiddenIndex = modulesHiddenCodes.indexOf(moduleCode)

    if (modulesPlacedIndex != -1) {
      // is a placed module
      const module = dag.modulesPlaced[modulesPlacedIndex]

      // O(1) delete
      if (dag.modulesPlaced.length > 1)
        dag.modulesPlaced[modulesPlacedIndex] = dag.modulesPlaced.pop()
      else dag.modulesPlaced = []

      dag.modulesHidden.push(module)
    } else if (modulesHiddenIndex != -1) {
      // is a hidden module
      const module = dag.modulesHidden[modulesHiddenIndex]

      if (dag.modulesHidden.length > 1)
        dag.modulesHidden[modulesHiddenIndex] = dag.modulesHidden.pop()
      // O(1) delete
      else dag.modulesHidden = []

      dag.modulesPlaced.push(module)
    } else {
      console.log('Module not found in DAG')
    }

    // update thisDag so that devs don't need a second query
    thisDag.modulesPlaced = dag.modulesPlaced
    thisDag.modulesHidden = dag.modulesHidden

    return await DAGRepository.save(dag)
  })

  if (!res) {
    console.log('Error in DAG.toggleModule')
    return
  }

  return res
}

export const DAGRepository = Repository.extend({
  initialize,
  build,
  toggleModule,
})
