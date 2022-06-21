import { ExtendedProps } from '@/types'
import { Button } from '@/ui/buttons'
import { ModuleIcon } from '@/ui/icons'
import { flatten } from '@/utils/tailwind'

export function ModuleRow(props: ExtendedProps['div']) {
  const { className, children, ...rest } = props
  return (
    <div
      className={flatten(
        'border-b border-b-gray-300 last:border-none',
        'flex flex-row items-center px-4 py-4',
        'bg-white',
        className
      )}
      {...rest}
    >
      <ModuleIcon className="mr-2" />
      <div className="flex-1">{children}</div>
      <Button className="text-sm px-3" color="red">
        Delete
      </Button>
    </div>
  )
}
