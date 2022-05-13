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

  /**
   * Constructor for User
   * @param {UserProps} props
   * @return {User}
   */
  static new(props: UserProps) {
    const user = new User()
    user.displayName = props.displayName || ''
    user.username = props.username || ''
    user.modulesCompleted = props.modulesCompleted || []
    user.modulesDoing = props.modulesDoing || []
    user.matriculationYear = props.matriculationYear || 2021
    user.graduationYear = props.graduationYear || 2025
    user.graduationSemester = props.graduationSemester || 2
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
   * @param {UserProps} props
   * @return {Promise<void>}
   */
  static async save(props: UserProps): Promise<void> {
    await container(async() => {
      const user = User.new(props)
      await AppDataSource.manager.save(user)
    })
  }
}
