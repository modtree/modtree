import { ExtendedProps, HeroIcon } from 'types'
import { flatten } from '@/utils/tailwind'
import { Button } from '@/ui/buttons'

export function BaseRow(
  props: ExtendedProps['div'] & { deletable?: boolean; icon?: HeroIcon }
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
        <Button className="text-sm px-3" color="red">
          Delete
        </Button>
      )}
    </div>
  )
}
