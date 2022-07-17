import { DegreeIcon, GraphIcon, ModuleIcon } from '@/ui/icons'
import { ExtendedProps } from 'types'
import { flatten } from '@/utils/tailwind'
import { Button, DeleteButton } from '@/ui/buttons'

type RowProps = {
  deletable?: boolean
  editable?: boolean
  onDelete?: () => void
  onEdit?: () => void
} & ExtendedProps['div']

export function BaseRow(props: RowProps) {
  const {
    className,
    children,
    deletable,
    editable,
    onDelete,
    onEdit,
    ...rest
  } = props
  return (
    <div
      className={flatten(
        'border-b border-b-gray-300 last:border-none',
        'flex items-center px-4 h-14',
        className
      )}
      {...rest}
    >
      <div className="flex-1">{children}</div>
      <div className="flex flex-row items-center space-x-2">
        {editable && (
          <Button onClick={onEdit} className="text-sm px-3" color="gray">
            Edit
          </Button>
        )}
        {deletable && (
          <DeleteButton onClick={onDelete ? onDelete : () => {}} />
          // <Button onClick={onDelete} className="text-sm px-3" color="red">
          // Delete
          // </Button>
        )}
      </div>
    </div>
  )
}

const ModuleRow = (props: RowProps) => {
  const { children, ...rest } = props
  return (
    <BaseRow {...rest} className="bg-white">
      <ModuleIcon className="mr-2" />
      {children}
    </BaseRow>
  )
}

const DegreeRow = (props: RowProps) => {
  const { children, ...rest } = props
  return (
    <BaseRow {...rest} editable className="bg-white">
      <DegreeIcon className="mr-2" />
      {children}
    </BaseRow>
  )
}

const GraphRow = (props: RowProps) => {
  const { children, ...rest } = props
  return (
    <BaseRow {...rest} className="bg-white">
      <GraphIcon className="mr-2" />
      {children}
    </BaseRow>
  )
}

const HeaderRow = (props: RowProps) => {
  const { children, ...rest } = props
  return (
    <BaseRow {...rest} className="font-semibold">
      {children}
    </BaseRow>
  )
}

const EmptyRow = (props: RowProps) => {
  const { children, ...rest } = props
  return (
    <BaseRow {...rest} className="bg-white">
      {children}
    </BaseRow>
  )
}

export const Row = {
  Degree: DegreeRow,
  Graph: GraphRow,
  Module: ModuleRow,
  Header: HeaderRow,
  Empty: EmptyRow,
}
