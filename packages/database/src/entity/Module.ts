import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import {
  AcadYear,
  ModuleCode,
  ModuleTitle,
  Department,
  Faculty,
  NUSModuleAttributes,
} from '../../types/nusmods'

@Entity({ name: 'module' })
export class Module {
  @PrimaryGeneratedColumn('uuid')
  id: number

  @Column({ type: 'text', default: null })
  acadYear: AcadYear

  @Column({ type: 'text', default: null })
  moduleCode: ModuleCode

  @Column({ type: 'text', default: null })
  title: ModuleTitle

  @Column({ type: 'text', default: null })
  description: string

  @Column({ type: 'text', default: null })
  moduleCredit: string

  @Column({ type: 'text', default: null })
  department: Department

  @Column({ type: 'text', default: null })
  faculty: Faculty

  @Column({ type: 'json', default: null })
  aliases: ModuleCode[]

  @Column({ type: 'json', default: null })
  attributes: NUSModuleAttributes

  @Column({ type: 'text', default: null })
  prerequisite: string

  @Column({ type: 'text', default: null })
  corequisite: string

  @Column({ type: 'text', default: null })
  preclusion: string

  @Column({ type: 'json', default: null })
  fulfillRequirements: ModuleCode[]

  // @Column({ type: 'json', default: null })
  // semesterData: SemesterData[]

  // @Column({ type: 'json', default: null })
  // prereqTree: PrereqTree

  // @Column({ type: 'json', default: null })
  // workload: Workload
}
