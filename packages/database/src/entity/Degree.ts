import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable , In } from 'typeorm'
import { Module } from './Module'
import { container, AppDataSource } from '../data-source'
import { DegreeInitProps, DegreeProps } from '../../types/modtree'

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
   * Constructor for Degree
   * Note: the props here is slightly different from DegreeInitProps
   * @param {DegreeProps} props
   * @return {Degree}
   */
  static new(props: DegreeProps): Degree {
    const degree = new Degree()
    degree.title = props.title || ''
    degree.modulesRequired = props.modulesRequired || []
    return degree
  }

  /**
   * Adds a Degree to DB
   * @param {DegreeInitProps} props
   * @return {Promise<void>}
   */
  static async save(props: DegreeInitProps): Promise<void> {
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
