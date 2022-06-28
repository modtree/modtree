import { DegreeIcon, GraphIcon, ModuleIcon } from '@/ui/icons'
import { ExtendedProps } from 'types'
import { flatten } from '@/utils/tailwind'
import { Button } from '@/ui/buttons'

type RowProps = {
  deletable?: boolean
  onDelete?: () => void
} & ExtendedProps['div']

export function BaseRow(props: RowProps) {
  const { className, children, deletable, onDelete, ...rest } = props
  return (
    <div
      className={flatten(
        'border-b border-b-gray-300 last:border-none',
        'flex items-center px-4 h-14',
        'bg-white',
        className
      )}
      {...rest}
    >
      <div className="flex-1">{children}</div>
      {deletable && (
        <Button onClick={onDelete} className="text-sm px-3" color="red">
          Delete
        </Button>
      )}
    </div>
  )
}

const ModuleRow = (props: RowProps) => {
  const { children, ...rest } = props
  return (
    <BaseRow {...rest} deletable>
      <ModuleIcon className="mr-2" />
      {children}
    </BaseRow>
  )
}

const DegreeRow = (props: RowProps) => {
  const { children, ...rest } = props
  return (
    <BaseRow {...rest} deletable>
      <DegreeIcon className="mr-2" />
      {children}
    </BaseRow>
  )
}

const GraphRow = (props: RowProps) => {
  const { children, ...rest } = props
  return (
    <BaseRow {...rest}>
      <GraphIcon className="mr-2" />
      <a>{children}</a>
    </BaseRow>
  )
}

const HeaderRow = (props: RowProps) => {
  const { children, ...rest } = props
  return (
    <BaseRow {...rest} className="font-semibold bg-gray-100">
      {children}
    </BaseRow>
  )
}

export const Row = {
  Degree: DegreeRow,
  Graph: GraphRow,
  Module: ModuleRow,
  Header: HeaderRow,
}
