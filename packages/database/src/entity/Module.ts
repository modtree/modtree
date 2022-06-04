import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import {
  SemesterData,
  PrereqTree,
  NUSModuleAttributes,
} from '../../types/nusmods'
import { Base } from './Base'

@Entity({ name: 'module' })
/** Module entity */
export class Module extends Base {
  @PrimaryGeneratedColumn('uuid')
    id: string

  @Column({ type: 'text' })
    acadYear: string

  @Column({ type: 'text' })
    moduleCode: string

  @Column({ type: 'text' })
    title: string

  @Column({ type: 'varchar', nullable: true })
    description: string

  @Column({ type: 'text' })
    moduleCredit: string

  @Column({ type: 'text' })
    department: string

  @Column({ type: 'text' })
    faculty: string

  @Column({ type: 'json', nullable: true })
    aliases: string[]

  @Column({ type: 'json', nullable: true })
    attributes: NUSModuleAttributes

  @Column({ type: 'text', nullable: true })
    prerequisite: string

  @Column({ type: 'text', nullable: true })
    corequisite: string

  @Column({ type: 'text', nullable: true })
    preclusion: string

  @Column({ type: 'json', nullable: true })
    fulfillRequirements: string[]

  @Column({ type: 'json', nullable: true })
    semesterData: SemesterData[]

  @Column({ type: 'json', nullable: true })
    prereqTree: PrereqTree

  @Column({ type: 'json', nullable: true })
    workload: string | number[]
}
