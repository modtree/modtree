import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import type { PrereqTree } from '../nusmods'
import { IModule } from './interface'

@Entity({ name: 'module' })
/** Module entity */
export class Module implements IModule {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('text')
  moduleCode: string

  @Column('text')
  title: string

  @Column('text', { nullable: true })
  prerequisite: string

  @Column('text', { nullable: true })
  corequisite: string

  @Column('text', { nullable: true })
  preclusion: string

  @Column('json', { nullable: true })
  fulfillRequirements: string[]

  @Column('json', { nullable: true })
  prereqTree: PrereqTree
}
