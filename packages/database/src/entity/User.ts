import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  FindOptionsRelations,
} from 'typeorm'
import { container } from '../data-source'
import { utils } from '../utils'
import { Module } from '../entity/Module'
import { UserRepository } from '../repository/User'
import { ModuleRepository } from '../repository/Module'

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: number

  @Column()
  displayName: string

  @Column()
  username: string

  @ManyToMany(() => Module)
  @JoinTable()
  modulesDone: Module[]

  @ManyToMany(() => Module)
  @JoinTable()
  modulesDoing: Module[]

  @Column()
  matriculationYear: number

  @Column()
  graduationYear: number

  @Column()
  graduationSemester: number

  /**
   * retrieve own relations
   *
   * @param {FindOptionsRelations<User>} relations
   */
  async loadRelations(relations: FindOptionsRelations<User>) {
    // find itself and load relations into a temporary variable
    const res = await UserRepository.findOne({
      where: {
        id: this.id,
      },
      relations,
    })
    // iterate through the requested relations and mutate `this`
    Object.keys(relations).map((key) => {
      this[key] = res[key]
    })
  }

  /**
   * Given a module code, checks if user has cleared sufficient pre-requisites.
   * Currently does not check for preclusion.
   *
   * @param{string} moduleCode
   * @return{Promise<boolean>}
   */
  async canTakeModule(moduleCode: string): Promise<boolean | void> {
    return await container(async () => {
      // find module
      const module = await ModuleRepository.findOne({
        where: {
          moduleCode: moduleCode,
        },
      })
      await this.loadRelations({ modulesDone: true })

      // check if PrereqTree is fulfilled
      const completedModulesCodes = this.modulesDone.map(
        (one: Module) => one.moduleCode
      )

      return utils.checkTree(module.prereqTree, completedModulesCodes)
    })
  }
}
