import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
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
  Module as NM
} from '../../types/nusmods'

// type Props = {
//   acadYear: AcadYear
//   moduleCode: ModuleCode
//   title: ModuleTitle
//   description: string
//   moduleCredit: string
//   department: Department
//   faculty: Faculty
//   aliases: ModuleCode[]
//   attributes: NUSModuleAttributes
//   prerequisite: string
//   corequisite: string
//   preclusion: string
//   fulfillRequirements: ModuleCode[]
//   semesterData: SemesterData[]
//   prereqTree: PrereqTree
//   workload: Workload
// }

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

  @Column({ type: 'longblob' })
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

  static new(props: NM) {
    const m = new Module()
    m.acadYear = props.acadYear || ''
    m.moduleCode = props.moduleCode || ''
    m.title = props.title || ''
    m.description = props.description || ''
    m.moduleCredit = props.moduleCredit || ''
    m.department = props.department || ''
    m.faculty = props.faculty || ''
    m.workload = props.workload || ''
    m.aliases = props.aliases || []
    m.attributes = props.attributes || {}
    m.prerequisite = props.prerequisite || ''
    m.corequisite = props.corequisite || ''
    m.preclusion = props.preclusion || ''
    m.prereqTree = props.prereqTree || ''
    m.semesterData = props.semesterData || []
    m.fulfillRequirements = props.fulfillRequirements || []
    return m
  }
}
