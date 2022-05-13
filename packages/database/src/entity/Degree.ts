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

      const degree = new Degree()
      degree.title = props.title
      degree.modulesRequired = modulesRequired
      await AppDataSource.manager.save(degree)
    })
  }
}
