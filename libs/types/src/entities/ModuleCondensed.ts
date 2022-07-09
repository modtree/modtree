import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { IModuleCondensed } from './interface'

@Entity({ name: 'module_condensed' })
/** ModuleCondensed entity */
export class ModuleCondensed implements IModuleCondensed {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('character varying')
  moduleCode: string

  // Numeric part of moduleCode
  @Column('integer')
  moduleLevel: number

  @Column('character varying')
  title: string
}
