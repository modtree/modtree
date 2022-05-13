import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm'
import { Module } from './Module'
import { container, AppDataSource } from '../data-source'
import { DegreeProps } from '../../types/modtree'
import { In } from 'typeorm'

@Entity({ name: 'degree' })
export class Degree {
  @PrimaryGeneratedColumn('uuid')
  id: number

  @ManyToMany(() => Module)
  @JoinTable()
  modulesRequired: Module[]

  @Column()
  title: string

  static new(props): Degree {
    const degree = new Degree()
    const { title = '', modulesRequired = [] } = props || {}
    degree.title = title
    degree.modulesRequired = modulesRequired
    return degree
  }

  /**
   * Adds a Degree to DB
   */
  static async add(props: DegreeProps): Promise<void> {
    await container(async() => {
      // find modules required, to create many-to-many relation
      const repo = AppDataSource.getRepository(Module)
      const modulesRequired = await repo.find({
        where: {
          moduleCode: In(props.moduleCodes),
        },
      })

      const degreeProps = {
        modulesRequired,
        title: props.title
      }

      const degree = Degree.new(degreeProps)
      await AppDataSource.manager.save(degree)
    })
  }
}
