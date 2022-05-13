import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { container, AppDataSource } from '../data-source'
import { Module } from '../entity'
import { utils } from '../utils'
import { UserProps } from '../../types/modtree'

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

  static new(props) {
    const user = new User()
    const { displayName = '', username = '', modulesCompleted = [], modulesDoing = [], matriculationYear = 2021, graduationYear = 2025, graduationSemester = 2 }: UserProps = props || {}
    user.displayName = displayName
    user.username = username
    user.modulesCompleted = modulesCompleted
    user.modulesDoing = modulesDoing
    user.matriculationYear = matriculationYear
    user.graduationYear = graduationYear
    user.graduationSemester = graduationSemester
    return user
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

  /**
   * Adds a User to DB
   */
  static async add(props: UserProps): Promise<void> {
    await container(async() => {
      const user = User.new(props)
      await AppDataSource.manager.save(user)
    })
  }
}
