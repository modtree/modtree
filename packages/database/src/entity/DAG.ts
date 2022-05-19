import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm'
import { container } from '../data-source'

import { User, Degree, Module } from '.'
import { ModuleRepository } from '../repository/Module'
import { DAGRepository } from '../repository/DAG'

@Entity({ name: 'DAG' })
export class DAG {
  @PrimaryGeneratedColumn('uuid')
  id: number

  @ManyToOne(() => User)
  @JoinTable()
  user: User

  @ManyToOne(() => Degree)
  @JoinTable()
  degree: Degree

  @ManyToMany(() => Module)
  @JoinTable()
  modulesPlaced: Module[]

  @ManyToMany(() => Module)
  @JoinTable()
  modulesHidden: Module[]

  /**
   * Toggle a Module's status between placed and hidden.
   * @param {string} moduleCode
   */
  async toggleModule(moduleCode: string): Promise<DAG> {
    const res = await container(async () => {
      const dag = await DAGRepository.findOne({
        where: {
          id: this.id,
        },
        relations: ['user', 'degree', 'modulesPlaced', 'modulesHidden']
      })

      const module = await ModuleRepository.findOne({
        where: {
          moduleCode,
        },
      })

      const modulesPlacedCodes = dag.modulesPlaced.map((one: Module) => one.moduleCode)
      const modulesPlacedIndex = modulesPlacedCodes.indexOf(moduleCode)

      const modulesHiddenCodes = dag.modulesHidden.map((one: Module) => one.moduleCode)
      const modulesHiddenIndex = modulesHiddenCodes.indexOf(moduleCode)

      if (modulesPlacedIndex != -1) {
        // is a placed module
        dag.modulesPlaced = dag.modulesPlaced.filter((one: Module) => one.moduleCode != moduleCode)
        dag.modulesHidden.push(module)
      } else if (modulesHiddenIndex != -1) {
        // is a hidden module
        dag.modulesHidden = dag.modulesHidden.filter((one: Module) => one.moduleCode != moduleCode)
        dag.modulesPlaced.push(module)
      } else {
        console.log('Module not found in DAG')
      }
      return await DAGRepository.save(dag)
    })

    if (!res) {
      console.log('Error in DAG.toggleModule')
      return
    }

    return res
  }
}
