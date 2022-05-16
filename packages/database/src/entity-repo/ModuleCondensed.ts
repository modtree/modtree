import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { ModuleCode, ModuleTitle } from '../../types/nusmods'

@Entity({ name: 'moduleCondensed' })
export class ModuleCondensed {
  @PrimaryGeneratedColumn('uuid')
  id: number

  @Column()
  moduleCode: ModuleCode

  // Numeric part of moduleCode
  @Column()
  moduleLevel: number

  @Column()
  title: ModuleTitle
}
