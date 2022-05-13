import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { container, AppDataSource } from '../data-source'
import { Module } from '../entity'
import { utils } from '../utils'

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: number

  @Column()
  displayName: string

  @Column()
  username: string

  @Column({ type: 'json' })
  modulesCompleted: string[]

  @Column({ type: 'json' })
  modulesDoing: string[]

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
      const repo = AppDataSource.getRepository(Module)
      const module = await repo.findOne({
        where: {
          moduleCode: moduleCode
        },
      })

      // check if PrereqTree is fulfilled
      return utils.checkTree(module.prereqTree, this.modulesCompleted)
    })
  }
}
