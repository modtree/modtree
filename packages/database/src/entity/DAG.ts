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

      // find index of the module in modulesPlaced
      // if index is unchanged, then the module must be in modulesHidden
      let placedIdx = -1
      for (let i=0; i<dag.modulesPlaced.length; i++)
        if (dag.modulesPlaced[i].moduleCode == moduleCode) {
          placedIdx = i
          break
        }

      if (placedIdx != -1) {
        // is a placed module
        dag.modulesPlaced = dag.modulesPlaced.filter((one: Module) => one.moduleCode != moduleCode)
        dag.modulesHidden.push(module)
      } else {
        // is a hidden module
        dag.modulesHidden = dag.modulesHidden.filter((one: Module) => one.moduleCode != moduleCode)
        dag.modulesPlaced.push(module)
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
