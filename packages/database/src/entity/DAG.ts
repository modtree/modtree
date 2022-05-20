import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm'
import { container } from '../data-source'
import { User, Degree, Module } from '.'
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
          dag.modulesHidden[modulesHiddenIndex] =
            dag.modulesHidden.pop() // O(1) delete
        else dag.modulesHidden = []

        dag.modulesPlaced.push(module)
      } else {
        console.log('Module not found in DAG')
      }

      // update this so that devs don't need a second query
      this.modulesPlaced = dag.modulesPlaced
      this.modulesHidden = dag.modulesHidden

      return await DAGRepository.save(dag)
    })

    if (!res) {
      console.log('Error in DAG.toggleModule')
      return
    }

    return res
  }
}
