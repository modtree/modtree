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
import { BaseEntity } from '../base/entity'

@Entity({ name: 'user' })
export class User extends BaseEntity {
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
    await super.loadRelations(relations, UserRepository)
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
