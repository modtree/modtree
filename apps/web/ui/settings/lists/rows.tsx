import { DegreeIcon, GraphIcon, ModuleIcon } from '@/ui/icons'
import { ExtendedProps, HeroIcon } from 'types'
import { flatten } from '@/utils/tailwind'
import { Button } from '@/ui/buttons'

type RowProps = {
  deletable?: boolean
  onDelete?: () => void
} & ExtendedProps['div']

export function BaseRow(
  props: ExtendedProps['div'] & {
    deletable?: boolean
    icon?: HeroIcon
    onDelete?: () => void
  }
) {
  const { className, children, ...rest } = props
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
      {props.icon && <props.icon className="mr-2" />}
      <div className="flex-1">{children}</div>
      {props.deletable && (
        <Button onClick={props.onDelete} className="text-sm px-3" color="red">
          Delete
        </Button>
      )}
    </div>
  )
}

const ModuleRow = (props: RowProps) => (
  <BaseRow {...props} icon={ModuleIcon} deletable />
)

const DegreeRow = (props: RowProps) => (
  <BaseRow {...props} icon={DegreeIcon} deletable />
)

const GraphRow = (props: RowProps) => {
  const { children, ...rest } = props
  return (
    <BaseRow {...rest} icon={GraphIcon}>
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
