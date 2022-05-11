import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import {
  AcadYear,
  ModuleCode,
  ModuleTitle,
  Department,
  Faculty,
  NUSModuleAttributes,
  SemesterData,
  PrereqTree,
  Workload
} from '../../types/nusmods'

@Entity({ name: 'module' })
export class Module {
  @PrimaryGeneratedColumn('uuid')
  id: number

  @Column({ type: 'text' })
  acadYear: AcadYear

  @Column({ type: 'text' })
  moduleCode: ModuleCode

  @Column({ type: 'text' })
  title: ModuleTitle

  @Column({ type: 'text' })
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
