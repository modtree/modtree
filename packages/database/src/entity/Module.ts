import { Entity, PrimaryGeneratedColumn, Column, ColumnType } from 'typeorm'
import {
  AcadYear,
  ModuleCode,
  SemesterData,
  Workload,
  PrereqTree,
  ModuleTitle,
  Department,
  Faculty,
  NUSModuleAttributes,
} from '../../types/nusmods'
import { config } from '../config'
import { Base } from './Base'

const descriptionType: ColumnType =
  config.type == 'postgres'
    ? 'varchar'
    : config.type == 'mysql'
      ? 'longblob'
      : 'text'

@Entity({ name: 'module' })
export class Module extends Base {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'text' })
  acadYear: AcadYear

  @Column({ type: 'text' })
  moduleCode: ModuleCode

  @Column({ type: 'text' })
  title: ModuleTitle

  @Column({ type: descriptionType, nullable: true })
  description: string

  @Column({ type: 'text' })
  moduleCredit: string

  @Column({ type: 'text' })
  department: Department

  @Column({ type: 'text' })
  faculty: Faculty

  @Column({ type: 'json' })
  aliases: ModuleCode[]

  @Column({ type: 'json' })
  attributes: NUSModuleAttributes

  @Column({ type: 'text' })
  prerequisite: string

  @Column({ type: 'text' })
  corequisite: string

  @Column({ type: 'text' })
  preclusion: string

  @Column({ type: 'json' })
  fulfillRequirements: ModuleCode[]

  @Column({ type: 'json' })
  semesterData: SemesterData[]

  @Column({ type: 'json' })
  prereqTree: PrereqTree

  @Column({ type: 'json' })
  workload: Workload
}
