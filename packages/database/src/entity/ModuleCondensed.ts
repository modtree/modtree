import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { ModuleCode, ModuleTitle } from '../../types/nusmods'
import { getModuleLevel } from '../utils/string'

type Props = {
  moduleCode: ModuleCode
  title: ModuleTitle
}

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

  /**
   * a drop-in replacement of a constructor
   * @param {Props} props
   * @return {ModuleCondensed}
   */
  static new(props: Props): ModuleCondensed {
    const m = new ModuleCondensed()
    m.title = props.title || ''
    m.moduleCode = props.moduleCode || ''
    m.moduleLevel = getModuleLevel(m.moduleCode)
    return m
  }
}
