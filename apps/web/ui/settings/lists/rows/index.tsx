import { ExtendedProps } from '@/types'
import { GraphHeaderRow, GraphRow } from './graph'
import { DegreeIcon, ModuleIcon } from '@/ui/icons'
import { BaseRow } from './base'

const ModuleRow = (props: ExtendedProps['div']) => (
  <BaseRow {...props} icon={ModuleIcon} deletable />
)

const DegreeRow = (props: ExtendedProps['div']) => (
  <BaseRow {...props} icon={DegreeIcon} deletable />
)

export const Row = {
  Degree: DegreeRow,
  Graph: GraphRow,
  GraphHeader: GraphHeaderRow,
  Module: ModuleRow,
}
