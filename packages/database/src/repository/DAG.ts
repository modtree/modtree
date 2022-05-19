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
      relations: ["modulesDone", "modulesDoing"],
    })
    const degree = await DegreeRepository.findOne({
      where: {
        id: props.degreeId,
      },
      relations: ["modules"],
    })
    let modulesPlaced: Module[] = [], modulesHidden: Module[] = [];

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

export const DAGRepository = Repository.extend({
  initialize,
  build,
})
