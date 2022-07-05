import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import type { PrereqTree } from '../nusmods'
import { Base } from './Base'

@Entity({ name: 'module' })
/** Module entity */
export class Module extends Base {
  @PrimaryGeneratedColumn('uuid')
  override id: string

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
