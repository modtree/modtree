import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm'
import { container } from '../data-source'
import { ModuleRepository } from '../repository/Module'
import { UserRepository } from '../repository/User'
import { Module } from '../entity-repo/Module'
import { utils } from '../utils'

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
  modulesCompleted: Module[]

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

      // Relations are not stored in the entity, so they must be explicitly
      // asked for from the DB
      const user = await UserRepository.findOne({
        where: {
          id: this.id,
        },
        relations: ['modulesCompleted'],
      })
      const modulesCompleted = user.modulesCompleted

      // check if PrereqTree is fulfilled
      const completedModulesCodes = modulesCompleted.map((one: Module) => one.moduleCode)

      return utils.checkTree(module.prereqTree, completedModulesCodes)
    })
  }
}
