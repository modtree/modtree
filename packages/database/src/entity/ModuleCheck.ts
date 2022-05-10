import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { ModuleCode } from '../../types/nusmods'

@Entity({ name: 'moduleCheck' })
export class ModuleCheck {
  @PrimaryGeneratedColumn('uuid')
  id: number

  @Column()
  moduleCode: ModuleCode
}
