import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import type { NUSMods } from '@modtree/types'
import { Base } from './Base'

@Entity({ name: 'module_full' })
/** Module entity */
export class ModuleFull extends Base {
  @PrimaryGeneratedColumn('uuid')
  override id: string

  @Column('text')
  acadYear: string

  @Column('text')
  moduleCode: string

  @Column('text')
  title: string

  @Column('varchar', { nullable: true })
  description: string

  @Column('text')
  moduleCredit: string

  @Column('text')
  department: string

  @Column('text')
  faculty: string

  @Column('json', { nullable: true })
  aliases: string[]

  @Column('json', { nullable: true })
  attributes: NUSMods.NUSModuleAttributes

  @Column('text', { nullable: true })
  prerequisite: string

  @Column('text', { nullable: true })
  corequisite: string

  @Column('text', { nullable: true })
  preclusion: string

  @Column('json', { nullable: true })
  fulfillRequirements: string[]

  @Column('json', { nullable: true })
  semesterData: NUSMods.SemesterData[]

  @Column('json', { nullable: true })
  prereqTree: NUSMods.PrereqTree

  @Column('json', { nullable: true })
  workload: string | number[]
}