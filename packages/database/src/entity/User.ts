import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, In } from 'typeorm'
import { container, AppDataSource } from '../data-source'
import { Module } from '../entity'
import { utils } from '../utils'
import { UserInitProps, UserProps } from '../../types/modtree'

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
   * Constructor for User
   * @param {UserProps} props
   * @return {User}
   */
  static new(props: UserProps): User {
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
          moduleCode: moduleCode,
        },
      })

      // Relations are not stored in the entity, so they must be explicitly
      // asked for from the DB
      const userRepo = AppDataSource.getRepository(User)
      const user = await userRepo.findOne({
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

  /**
   * Adds a User to DB
   * @param {UserProps} props
   * @return {Promise<void>}
   */
  static async save(props: UserInitProps): Promise<void> {
    await container(async () => {
      // find modules completed and modules doing, to create many-to-many relation
      const repo = AppDataSource.getRepository(Module)
      const modulesCompleted = await repo.find({
        where: {
          moduleCode: In(props.modulesCompleted),
        },
      })
      const modulesDoing = await repo.find({
        where: {
          moduleCode: In(props.modulesDoing),
        },
      })

      const userProps = {
        displayName: props.displayName,
        username: props.username,
        modulesCompleted,
        modulesDoing,
        matriculationYear: props.matriculationYear,
        graduationYear: props.graduationYear,
        graduationSemester: props.graduationSemester
      }

      const user = User.new(userProps)
      await AppDataSource.manager.save(user)
    })
  }
}
