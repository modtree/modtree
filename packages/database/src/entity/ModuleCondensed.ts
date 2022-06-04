import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { ModuleCode, ModuleTitle } from '../../types/nusmods'
import { Base } from './Base'

@Entity({ name: 'moduleCondensed' })
/** ModuleCondensed entity */
export class ModuleCondensed extends Base {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  moduleCode: ModuleCode

  // Numeric part of moduleCode
  @Column()
  moduleLevel: number

  @Column()
  title: ModuleTitle
}
