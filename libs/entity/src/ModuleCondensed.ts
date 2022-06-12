import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { Base } from './Base'

@Entity({ name: 'moduleCondensed' })
/** ModuleCondensed entity */
export class ModuleCondensed extends Base {
  @PrimaryGeneratedColumn('uuid')
  override id: string

  @Column()
  moduleCode: string

  // Numeric part of moduleCode
  @Column()
  moduleLevel: number

  @Column()
  title: string
}
