import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity({ name: 'cypress_run' })
/** ModuleCondensed entity */
export class CypressRun {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('text')
  file: string

  // Numeric part of moduleCode
  @Column('integer')
  timestamp: number

  @Column('text')
  gitHash: string

  @Column('boolean')
  pass: boolean
}
